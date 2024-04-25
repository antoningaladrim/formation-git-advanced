# git-formation

Let's learn how to use interactive rebases  
This exercise assumes you are comfortable with a regular rebase. If you aren't, go do the exercise on `exo/rebase-basic`.

In this branch, there are 6 commits. One out of two commit is just fixing a typo in the previous commit.  
Using the command `git rebase -i main`, find a way to squash the commits with the message `typo fixup` with the previous commit in the chain.

Every detail you need to complete this exercise is present in the little menu that appears when you run `git rebase -i`.  
As a hint, the options that you need to look at are `squash` and / or `fixup`

## What is an interactive rebase?

Sometimes you just want to move every commit from branch A to branch B. In that case, `git merge` or `git rebase` is enough.

But sometimes, you need to do more complex operations. When you need to really manipulate the history of your branch, that's when you use an interactive rebase.  
`git rebase -i` allows you to do many operations, such as squashing (fusing) commits together, removing entire commits, changing a commit's message, editing a commit etc etc.

In the case of this exercise, the use case is pretty common: you make a commit, you realise you made a typo in some variable name or forgot some dependency, so you make a new commit to fix it.  
The problem is that this new commit is kind of useless, it just takes up space to fix a small mistake you just made.

The good thing is that you can pretend like you never made a mistake in the first place! Just manipulate your history, and boom: your git logs are cleaner.

There are plenty of other ways of doing this, the most common being `git commit --amend`, which squishes the changes in your staging area (so, anything you used `git add` on) with your previous commit, to make a brand new commit.  
But `git rebase -i` really allows you to have an overview over a series of changes, NOT just the last commit.
