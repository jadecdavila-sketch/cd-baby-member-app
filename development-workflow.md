## When working on a new ticket
Before working on a ticket, you need to have everything on the onboarding finished, a ticket assigned to you and the [Platform](https://github.com/CD-Baby/Platform) repository cloned **and** the latest changes to the **main** branch pulled.

### Creating a new branch
First of all, you need to create the branch based on the **target** branch from the Platform repository. The branch can be a release branch, a sprint branch or an experimental branch, something that will be agreed upon before starting any sort of development. 

The name of the branch should include the name of the ticket preceded by the type (`bugfix` or `feature` for tasks) and a `/` and your username or your name (abbreviated) if possible. For example if you have a ticket named "___CBC-01 Test ticket___" the branch should be named `bugfix/jsmith-CBC-01` if it's a bug and `feature/jsmith-CBC-01` if it's a feature. 

You can always include the summary of the ticket as the name to make it more clear and to avoid confusion, just remember to switch spaces for dash-case. For example considering the same "___CBC-01 Test ticket___" jira ticket, the branch should be name `feature/jsmith-CBC-01-test-ticket` or `bugfix/jsmith-CBC-01-test-ticket` once again depending on the type of task.

#### (!) Tip:
Inside the Jira ticket on the right side, you can find the "___Create branch___" button, which automatically creates it on your repository by selecting the parent repository and branch.

Now on your IDE of choice, remember to switch to your new branch to start development.

### Finishing your work
When you have finished all your tasks and met your acceptance criteria, it's time to push the changes to the repository. You can do this using your visual Git tools or using the terminal.

#### Pushing your changes using the terminal
#### 1. Add your changes
Add the files you've worked on using the `git add` command followed by the changed file or files:
    git add your/file.js

If you're ___absolutely and completely___ sure all the changes you're made are ready to go, you can add them together using one command:

    git add .
#### 2. Commit your changes

Once you've added all your files to the __Staged files__ stack, you can commit them using the `git commit -m "(your message)"` command. For your commit message, please include the ticket numbre and a brief descriptive of __the intent__ of your changes, not a technical descriptions of the changes you've made. For example:

    git commit -m "CBC-01 Added starter JS and HTML files"


Please try to avoid vague or unhelpful commit messages such as:

    git commit -m "some changes"

__(!) Tip__: You can combine both `add` and `commit` using one singular command:

    git commit -a -m "CBC-01 Added starter JS and HTML files"

#### 3. Merge the target branch to your own branch.
Since enough time may have passed since started working on the ticket and the _target_ branch is updated constantly, you need to `checkout` back to it and pull the latest changes. Doing this here also has the benefit of being able to catch any merge error or conflict that may pop up after creating the pull request. For the following example, we will use `feature/release-hotfix` as an example of a target branch

First, switch to the target branch, you can do this using your IDE or with the following command:

    git checkout feature/release-hotfix

Now run the following commands to pull the newest changes:

  >`git fetch -p` latest from remote without trying to merge or rebase anything
  >
  >`git reset --hard origin/feature/release-hotfix` resets the target branch to latest changes
  >
  >`git pull --rebase` synchronizes latest server changes and puts commit at the top of the log

Afterwards, checkout to your branch again:

    git checkout your-branch

Finally, merge it with the target branch:

    git merge feature/release-hotfix

#### 4. Push your changes
Once you're changes are committed and the branch is updated with the target, just run the following command:

    git push -u origin "your-branch-name"
