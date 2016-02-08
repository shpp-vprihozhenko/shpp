FROM ubuntu
copy server_tcp.js .
RUN apt-get update
RUN apt-get install -y nodejs
CMD ["nodejs", "server_tcp.js"]
