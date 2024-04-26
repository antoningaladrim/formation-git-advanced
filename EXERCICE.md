# git-formation

**Goal**: continue learning interactive rebases, as well as the `--keep-base` option

This exercise assumes you are comfortable with a regular rebase. If you aren't, go do the exercise on `exo/rebase-basic`.

This is a very similar exercise to `exo/rebase-interactive-fixup`, but it's still good practice + you can learn a few extra things.

In this branch, we have made an original commit with some changes, and then 6 commits that just fixed typos and other issues.  
We do not need to have 7 commits in the history, so we'll squash them all together and keep a single commit instead.  
We also want the singular commit in this branch to have the following message: `dev: implement super cool feature`

Run `git rebase -i --keep-base main`, and squash all the extra commits into the first one!

Every detail you need to complete this exercise is present in the little menu that appears when you run `git rebase -i`.  
As a hint, the options that you need to look at are `squash` and / or `fixup`, as well as `reword`.

## What is an interactive rebase?

Go read this section in `exo/rebase-interactive-fixup` if you're unfamiliar with interactive rebases

## What is the `--keep-base` option?

If you read the first commit of this branch, the message says `made a commit that will generate conflicts with main if you rebase`  
This branch is based on a previous commit of the `main` branch. This means the branches are not "synchronised".  
If we were to rebase this branch on `main`, we would incorporate commits from `main`, which would cause conflicts.

Here, we only want to manipulate the history of our branch, we don't want to incorporate new commits from `main`.  
The `--keep-base` option allows us to manipulate our branch's history, without changing the actual base (literally, "keep the base").

When you run `git rebase --keep-base main`, git will:

- find the common ancestor commit between your current branch and `main`
- replay all commits from this common ancestor until the tip of your current branch against your branch
- git will NOT incorporate any new commits from `main`, you are telling git that you do not want to change your branch's base at all

So why use this option?  
Sometimes you want to incorporate commits from another branch. Sometimes you don't, you only want to manipulate your branch's history so that it's more readable, or to edit a mistake you made along the way.  
Here, we're trying to squash a bunch of commits into one, there's no need to incorporate extra commits from `main`. So we use `--keep-base` to simplify our process.
