# git-formation

So far, we have used `git rebase` either formanipulating your branch's history, or incoporating new commits from your branch's base.

But what happens if you run a `rebase` on a branch that has been rewound\*?  
\* a "rewound" branch is a branch that has had its history rewritten. If you remove a commit, change the order of commits, squash some commits etc, you have rewound your branch.

This is the current exercise's branch tree:

```
A---B---C---D (exo/rebase-fork-point)
             \
              E---F (exo/rebase-fork-point-feature)
```

As you can see, there is an `exo/rebase-fork-point-feature` branch that is based on `exo/rebase-fork-point`.

Remove the two last commits (`C` and `D`) from `exo/rebase-fork-point`.  
You can do it using whichever method you like. Either `git reset --hard HEAD~2`, or `git rebase -i --keep-base` and use the `drop` command on the bottom two commits.

What do you think your branch tree looks like now?  
Run `git switch exo/rebase-fork-point-feature` and run `git log`. You should see something like:

```
A---B (exo/rebase-fork-point)
     \
      C---D---E---F (exo/rebase-fork-point-feature)
```

As you can see, the commits you just removed from `exo/rebase-fork-point` didn't magically disappear from `exo/rebase-fork-point-feature`.  
If you merged `exo/rebase-fork-point-feature` into `exo/rebase-fork-point`, you would end up keeping the commits you tried to remove.

You can imagine how this could cause issues.  
You can remove the commits manually from `exo/rebase-fork-point-feature` too, but that can become really annoying and complicated.

Git can be quite smart, and has a way to automate this! It involves the `--fork-point` option of `git rebase`.

The exercise is to figure out how to remove these commits from `exo/rebase-fork-point-feature` without removing them manually, using the `--fork-point` option.

I really recommend you read on to understand when this option might be useful, and how it functions.

## When and why use `git rebase --fork-point`?

You should use `--fork-point` when you have edited your base branch in any way. This includes:

- when you have used `git reset` on it, specifically if the commits you removed this way were also in another branch
- when you run a rebase on your base branch. Really, any rebase that does anything, unless you're 100% certain it hasn't affected any commits present in other branches.

However these two use cases should ideally never happen.  
Rewinding a base branch is a terrible idea for many reasons, mainly since it requires extra work to "fix" the history.  
This is even worse if you rewind a public branch on a repo where multiple people work on. If anyone has work based on the branch you rewound, you will cause many history issues and conflicts.

Consider the second use case, when the base branch has been rebased. Imagine the following architecture:

```

A---B---C---D (main)
        \
         E---F (dev)
              \
                G---H (feature)
```

If you'd like to incorporate the changes from commit `D` into both the `dev` and `feature` branches, you might be tempted to just rebase `dev` on `main`, and then `feature` on `dev`.  
But that's a terrible idea. Here's why:

If you run `git rebase main dev`, your branches will look like this

```
A---B---C---D (main)
        |    \
         \    E'---F' (dev)
          \
           E---F---G---H (feature)
```

Again, notice how commits `E` and `F` didn't magically disappear from `feature`. Git doesn't know these commits originally belonged to `dev`, it **only knows they are on the `feature` branch**.  
Also notice how the commits on dev are named `E'` and `F'` here. This is to show that they have (roughly) the same content, but **_they do not have the same commit SHA, they are completely different commits!_**

If you then run `git rebase dev feature`, you would have this:

```
A---B---C---D (main)
             \
              E'---F' (dev)
                    \
                     E---F---G---H (feature)
```

Here you can see we kept the `E` and `F` commits, even though they are duplicates of the content in `E'` and `F'`.  
It might not break anything, but these _could_ introduce errors, conflicts, and they generally make your git history less clear.

If instead we had run `git rebase --fork-point dev feature`, we would have this:

```
A---B---C---D (main)
             \
              E'---F' (dev)
                    \
                     G---H (feature)
```

A better way to avoid this is to simply not rebase your base branch... ever! Until you're ready to merge it of course.  
It would make more sense to first merge `feature` into `dev`, and to then rebase `dev` on `main`.

If you absolutely need to incorporate changes from main before being ready to merge, you could just cherry-pick the commits into `dev`, then rebase `feature` on `dev`.  
Yes, that will also create "duplicate" commits, but it will most likely be less work, and will usually result in very few duplicated commits.

## How does `git rebase --fork-point` work?

This is less crucial to understand, but if you're curious, imagine this exercise's premise once more:

```
A---B---C---D (main)
             \
              E---F (exo/rebase-fork-point)
```

Where, once again, `D` was removed from main, and another commit `D'` was pushed, resulting in this:

```
A---B---C---D' (main)
        \
         D---E---F (exo/rebase-fork-point)
```

When we run `git rebase main exo/rebase-fork-point`, git will:

- find the common ancestor commit between `main` and `exo/rebase-fork-point` (here it is `C`)
- take all commits between the common ancestor (`C`) and the tip of the branch we are rebasing (`F`)
- replay all those commits on top of `main`
- check for conflicts etc etc

When we run `git rebase --fork-point main exo/rebase-fork-point`, git will:

- take every commit in the branch we are rebasing (`exo/rebase-fork-point`), starting from the tip (`F`)
- for every commit, use the reflog to check if that commit has ever been part of the branch we're rebasing on (`main`).
- once a commit that has been on the target branch (`main`) has been found, run the equivalent of a `git rebase --onto`, with the diverging commit as the old base, and the target branch as the new base.

Complicated, no? But pretty much, in our example:

- git will start from commit `F`, going backwards, and for each commit use the reflog to check if that commit was ever a part of `main`
  - Here, git will see that `F` and `E` were never part of `main`.
- git will find that `D` was once a part of main, it marks it as the first divergent commit (the "fork point", literally)
- git will then run the equivalent of `git rebase --onto D main`. We consider that `D` is the "old base", and the "new base" is `main`.
  - This will effectively remove the `D` commit, and every commit behind it that isn't part of the `main` branch, before rebasing on top of `main`. This is exactly what we want.
