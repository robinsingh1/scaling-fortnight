# Creating Supervisor Conf

sudo honcho export -f Procfile -c all=1,worker=10 -a triggeriq supervisord /etc/supervisor/conf.d -u robin

# Then Add These Lines To The Top Of The Other File

[supervisord]
logfile=/tmp/supervisord.log ; (main log file;default $CWD/supervisord.log)
logfile_maxbytes=50MB        ; (max main logfile bytes b4 rotation;default 50MB)
logfile_backups=10           ; (num of main logfile rotation backups;default 10) 
loglevel=info                ; (log level;default info; others: debug,warn,trace)
pidfile=/tmp/supervisord.pid ; (supervisord pidfile;default supervisord.pid)
nodaemon=true               ; (start in foreground if true;default false)
minfds=1024                  ; (min. avail startup file descriptors;default 1024)
minprocs=200                 ; (min. avail process descriptors;default 200)

[inet_http_server]
port=127.0.0.1:9001   ;

[supervisorctl]
serverurl=http://127.0.0.1:9001 ;

# Start Processes

supervisord -c /etc/supervisor/conf.d/triggeriq.conf
