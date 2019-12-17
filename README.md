# NodeRacer

A dynamic race detector with guided execution for Node.js applications. 

This page contains the source code of NodeRacer and instructions to replicate the experiments, reported in a paper submitted to ICST 2020.

## Table of Contents

- [Instructions to install](#install)
- [Usage and tool's modules](#usage-and-tools-modules)
- [Experimental package](#experimental-package)
- [License](#license)

## Install

- System configuration:
  - Dell Latitude 5590 Intel I7 1.9GHz 16GB RAM
  - Ubuntu 18.04 LTS (kernel 4.15.0-64-generic)

- Third-party software:
  - Install [Node.js](https://nodejs.org/en/download/) and npm (version used LTS 10.16.3)
  - Install git, Redis and MongoDb (used by some benchmarks), R and cloc (collect and process stats of the paper)
    ```bash
    sudo apt install git redis-server mongodb r-base cloc
    ```

- Instructions to install NodeRacer:
  - In the terminal, run the following commands to clone the repository, install dependencies, and make command noderacer available. 
    ```bash
    git clone https://github.com/noderacer/noderacer.git
    cd noderacer
    npm install
    npm link
    ```
  - To run the micro-benchmark tests (it may take a couple of minutes). See the micro-benchmark in [here](tests/micro-benchmark).
    ```bash
    npm test
    ```

## Usage and tool's modules

If correctly installed, you can run NodeRacer in the terminal.  
```bash
noderacer --help
```  
This will show the options available to configure NodeRacer. The entry point for the CLI is coded in [lib/cli/cli.js](lib/cli/cli.js).

- Observation phase
  - This phase can be run with `noderacer log <command>`, where `<command>` starts the sample run used; further configurations can be added using `-c <config_file>`, see [here](lib/logger/settings-example.json) for a config file example. 
  - Example:
    ```bash
    noderacer log node tests/micro-benchmark/paper-examples/archive-like-test.js  
    ```  
  - This command creates a log file in folder `log/<ID_FOR_COMMAND>/noderacer?.log.json`.
  - See this module code [here](lib/logger).
- Happens-before identification phase
  - This phase can be run with `noderacer hb <logfile>`, where `<logfile>` is the path to the log file generated in the previous phase. 
  - Example:
    ```bash
    noderacer hb log/<ID_FOR_COMMAND>/noderacer1.log.json -i
    ```  
  - This command creates files and images related to the identified happens-before relations in folder `log/<ID_FOR_COMMAND>`.
  - See this module code [here](lib/hb); in particular, the implementation of the nine rules used to identify the happens-before relations can be seen [here](lib/hb/rules).
- Guided execution phase
  - This phase can be run with `noderacer control -s <strategy> -r <runs> -h <hbfile> <command>`, where `<strategy>` defines how guided execution is performed (parameter `random` is the strategy described in the paper), `<runs>` specifies how many repetitions (runs), `hbfile` is the path to file `noderacer?.hb.json` (generated in the previous phase), and `<command>` starts the sample run used (as in observation phase). 
  - Example:
    ```bash
    noderacer control -s random -r 10 -h log/<ID_FOR_COMMAND>/noderacer1.hb.json node tests/micro-benchmark/paper-examples/archive-like-test.js
    ```
  - This command creates folder `log/<ID_FOR_COMMAND>/exec?` with log files that track the execution and decisions of each guided run. 
  - See this module code [here](lib/controller); in particular, the implementation of the guided execution described in the paper can be seen [here](lib/controller/strategies/random1.js).
- Reports and diagnosis
  - All artefacts generated by NodeRacer (JSON files and images) can be found in the log folder determined (i.e., folder `log/<ID_FOR_COMMAND>`). A preliminary version of NodeRacer's web report can be seen by running `noderacer report <pathtologfolder>`.  
  - The diagnosis mode is implemented as a different strategy for the guided execution phase (parameter `1-postpone-history`). To use it, run `noderacer control -s 1-postpone-history -r <runs> -h <hbfile> <command>`.  

## Experimental package

- Download and unzip the benchmark applications from [here](https://www.dropbox.com/s/j9l1v42o8auaryl/noderacer-benchmarks.tar.gz).
  ```bash
  tar -xvf noderacer-benchmarks.tar.gz
  ```
  - This zip file also includes a compiled version of the Node.fz tool, obtained from [here](https://github.com/VTLeeLab/NodeFz).
- Set up the location of the benchmarks' folder
  - Edit file `tests/experiments/benchmark_config.js` (see it [here](tests/experiments/benchmark_config.js))
  - Update it to the folder where `noderacer-benchmarks.tar.gz` was extracted. This configuration file is used by the experiments' scripts.
- RQ1 (comparison with Node.fz)
  - To collect results related to the comparisons, run the following commands. Specific details and configurations are described as comments in the scripts.
    ```bash
    node tests/experiments/known-bugs/start-noderacer.js 
    node tests/experiments/known-bugs/start-nodefz.js
    ```    
  - See the scripts [here](tests/experiments/known-bugs).
  - The raw data collected and used in the paper and the R script can be seen [here](tests/experiments/known-bugs/data).
- RQ2 (no happens-before used - NR-naive)
  - To collect results related to NR-naive, run the following command. Specific details and configurations are described as comments in the script.
    ```bash
    node tests/experiments/naive/start-naive.js   
    ```    
  - See the scripts [here](tests/experiments/naive).
  - The raw data collected and used in the paper can be seen [here](tests/experiments/naive/data).

- RQ3 (open issues)
  - The full description for each issue can be read [here](tests/experiments/open-issues).
  - For each open issue analyzed, we provided a script that runs NodeRacer. Specific details and configurations to reproduce the analysis of each issue are described as comments in these scripts. See the scripts [here](tests/experiments/open-issues).
  - We used a scrapper to collect GitHub data. The scrapper code can be seen [here](tests/experiments/github-scrapper).
- RQ4 (existing test suites)
  - To run all the 159 tests that have callback interleavings, see the script [here](tests/experiments/exploratory/all-tests). 
      ```bash
      node tests/experiments/exploratory/all-tests/start-run-all.js  
      ```
  - For each test that failed at least once in 100 runs, we conducted an investigation and provided a script that runs NodeRacer. Specific details and configurations to reproduce the analysis of each failing test are described as comments in the scripts; see the scripts [here](tests/experiments/exploratory/failing-tests). For example, the 1st test of mongo-express that failed can be run with:
    ```bash
    node tests/experiments/exploratory/failing-tests/mongo-express-1.js  
    ```      
  - To replicate the steps performed to filter the tests used in the experiment, see [here](tests/experiments/exploratory/filtering).

  ## License
Copyright 2019 casa.au.dk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.