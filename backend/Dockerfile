FROM ubuntu:latest

RUN apt-get update \
  && apt-get install -y python3-pip python3-dev sqlite3 \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 install --upgrade pip
COPY . /code
WORKDIR /code
RUN pip3 install -r ./requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]

