/**
 * 
 Command to run Node.fz with the 1st paper example:

 rm arc-like.log; for i in `seq 1 1000`; do echo $i; UV_THREADPOOL_SIZE=1 UV_SCHEDULER_TYPE=TP_FREEDOM UV_SCHEDULER_TP_DEG_FREEDOM=-1 UV_SCHEDULER_TP_MAX_DELAY=100 UV_SCHEDULER_TP_EPOLL_THRESHOLD=100 UV_SCHEDULER_TIMER_LATE_EXEC_TPERC=200 UV_SCHEDULER_IOPOLL_DEG_FREEDOM=-1 UV_SCHEDULER_IOPOLL_DEFER_PERC=10 UV_SCHEDULER_RUN_CLOSING_DEFER_PERC=5 UV_SILENT=1 UV_PRINT_SUMMARY=0 /home/user/git/NodeFz/out/Release/node tests/micro-benchmark/paper-examples/archive-like-test.js >> arc-like.log; sleep .5; done; grep -ci "Done. Finalizing." arc-like.log
 * 
 */
require('./archive-like').main()