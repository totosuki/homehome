FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y python3 python3-pip curl tmux vim
RUN pip install pandas fastapi uvicorn apscheduler