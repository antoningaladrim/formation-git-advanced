# git-formation

**Goal**: Learn how to do a regular rebase

**Instructions**:

- run `git rebase main`
- resolve conflicts as they come up (keep the changes from `exo/rebase-basic`)
- run `git rebase --continue` between each commit to go to the next one
- run `git rebase --abort` to abandon the rebase if you mess up

You can then `git push --force-with-lease` to reflect your changes on the repo.

Feel free to ask me any questions if you're struggling or need an explanation!

## What is a rebase?

Consider the following branches and commits:

```
A---B---C---F (main)
         \
          D---E (dev)
```

`dev` is a branch that is based on the commit `C` of the `main` branch.  
Here, `C` is considered to be the base of `dev`.

You can see that the `F` commit was created after `dev`, so we do not have access to its changes in the `dev` branch.  
As things are right now, if you were to merge `dev` in `main`, you could have conflicts because neither branch has all the data of the other.

This is where `git rebase` comes in, as it allows you to change the base of a branch (RE-base), incorporating any changes introduced to the base branch (here it is `main`).

After running `git rebase main dev`, where `main` is the new base, and `dev` is the branch whose base we want to change, we would have this:

```
A---B---C---F (main)
            \
             D'---E' (dev)
```

Notice that in this diagram, `dev`'s commits are now `D'` and `E'`. This is to show that _they are not the same commits as before the rebase_!  
They may have similar content, but they do not have the same commit SHA etc.

## How does a rebase work?

When we run `git rebase main dev`, what happens is:

- git finds the most recent commit in common between `main` and `dev`
- git takes every commit between that commit in common and the tip of `dev`, and replays\* them on top of `main`
- every time a commit from `dev` is replayed on top of `main`, git checks for conflicts and prompts the user to resolve them
- once every conflict has been resolved, the user can run `git rebase --continue` to move to the next commit to replay

\* "replaying a commit on `main`" here means "pretending like we're pushing an exact copy of a commit at the tip of the `main` branch and seeing if there are any conflicts"

In this example, once the rebase is complete, git will take the resulting string of commits (every commit replayed on top of `main`) and will save this as the new `dev` branch.

See the diagram below for a more visual representation of a `git rebase`:  
[Rebase diagram](https://drive.google.com/file/d/1OGEhL3sN1g1eiqL4ECTJbySF9fRS32sa/view)

Once this is done, the `dev` branch will have its history be fully compatible with `main`. If we then run `git merge main dev`, it will do a fast-forward merge, meaning there will be no conflicts.

## When and why should I use rebase?

`git rebase` allows you to apply changes that were made to your base branch and reflect them on your current branch.  
This means you should use it when:

- You have made a change in your base branch that would be useful for you to have in your current branch
- You want to prepare your current branch to merge it into your base branch.

Rebasing your branches when you need to include changes allows you to keep a clean, linear history that is fully compatible between your base and current branch. If we then merge our branch into our base, it will do a fast-forward merge, meaning there will be no conflicts.

You might be tempted to do these kinds of operations with a merge though. Let's see how merge and rebase differ.  
Let's take the example from earlier:

```
A---B---C---F (main)
         \
          D---E (dev)
```

We will now do the following two operations, using rebase and merge:

1. apply the `F` commit to the `dev` branch
2. merge `dev` into `main`

### With rebase:

`git rebase main dev`  
Conflict resolution happens here

```
A---B---C---F (main)
            \
             D'---E' (dev)
```

`git merge dev main`

```
A---B---C---F---D'---E' (main, dev)
```

The merge is a fast-forward which means no merge commit, no conflict, linear history

### With merge:

`git merge main dev`  
Conflict resolution happens here

```
A---B---C-------F (main)
        \       \
         D---E---M (dev)
```

`M` is the merge commit created

`git merge dev main`  
Conflict resolution happens here too!

```
A---B---C------F----M2 (main)
        \       \  /
         D---E----M (dev)
```

`M2` is yet another merge commit

A merge is fine, but you can see the history is not the same.  
During a rebase, the resulting history is linear and simple to understand, though it keeps each individual commit from your branch.  
During a merge, because of the 3-way merges, the history is a bit harder to read, but everything is merged into a single commit so it's easier to see where merges happened.

I generally recommend rebasing unless it causes a bunch of issues.
