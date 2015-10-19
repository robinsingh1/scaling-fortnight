# General Guidelines
# - Docker Actions that change often should be separated and moved lower in the order,
#     to speed up build times (e.g. copying app code)
# - Docker Actions that change rarely should be combined to reduce layers,
#     which speeds up deploy times (e.g. setting ENV VARS)

FROM ubuntu:trusty

# ENV VARS are loaded in a single line to reduce number of images

USER root

RUN apt-get update
RUN apt-get install -y libcurl4-openssl-dev python-dev python-pandas python-pip

RUN mkdir /app
WORKDIR /app

# copy requirements and run pip install
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# copy the rest of the app
COPY . /app/

# compile assets ?

CMD ["/bin/bash"]
