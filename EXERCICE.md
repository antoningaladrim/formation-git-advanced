# git-formation

Let's learn how to use interactive rebases  
This exercise assumes you are comfortable with a regular rebase. If you aren't, go do the exercise on `exo/rebase-basic`.

In this branch, there are 6 commits. One out of two commit is just fixing a typo in the previous commit.  
Using the command `git rebase -i main`, find a way to squash the commits with the message `typo fixup` with the previous commit in the chain.

Every detail you need to complete this exercise is present in the little menu that appears when you run `git rebase -i`.  
As a hint, the options that you need to look at are `squash` and / or `fixup`
