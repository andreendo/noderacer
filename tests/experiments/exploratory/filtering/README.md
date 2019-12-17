We performed several steps to sample the projects used in RQ4. 
Each step involves the execution of one or more scripts.

- The projects initially considered were extracted from 2 curated lists of Node.js projects.
    - https://github.com/sqreen/awesome-nodejs-projects
    - https://github.com/sindresorhus/awesome-nodejs
    - See selected projects [here](/tests/experiments/exploratory/filtering/step0/list-projects.csv).

- Step 0 - download the initial set of projects, install dependencies, and check for projects that use Mocha:
    ```bash
        ./step0/gitclone.sh
        ./step0/runnpminstall.sh
        node step0/filter-projects-with-mocha.js
    ```

- Step 1 - Run first `npm test` and then vanilla Mocha:
    ```bash
        node step1-1-runnpmtest.js
        node step1-2-runmocha.js
    ```

- Step 2 - Run Mocha with a custom report (the Mocha's customized reporter can be seen [here](/tests/experiments/exploratory/filtering/mochaReporter.js)).
    ```bash
        node step2-custom-reporter.js
        node step2-summary.js
    ```
    
- Step 3 - Run each Mocha test individually.
    ```bash
        node step3-runind.js
        node step3-summary.js
    ```

- Step 4 - For each individual and passing TC, run NodeRacer to check each phase.
    - Step 4.1 - observation phase
        ```bash
            node step4-1-obs.js
            node step4-1-summary.js
        ```
        
    - Step 4.2 - happens-before identification phase
        ```bash
            node step4-2-hb.js
            node step4-2-summary.js
        ```

    - Step 4.3 - guided execution phase
        ```bash
            node step4-3-guided.js
            node step4-3-summary.js
        ```

- Step 5 - For the selected sample, use the script to run all tests; see [here](/tests/experiments/exploratory/all-tests).