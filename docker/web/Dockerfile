# General Guidelines
# - Docker Actions that change often should be separated and moved lower in the order,
#     to speed up build times (e.g. copying app code)
# - Docker Actions that change rarely should be combined to reduce layers,
#     which speeds up deploy times (e.g. setting ENV VARS)

FROM picobit/clearspark-base:latest

# ENV VARS are loaded in a single line to reduce number of images
ENV WEB_PORT=5000

USER root

WORKDIR /app

# compile assets?

CMD ["gunicorn", "routes:app", "-b", "0.0.0.0:5000", "-w", "4"]

EXPOSE 5000
