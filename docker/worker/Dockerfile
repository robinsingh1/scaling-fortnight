# General Guidelines
# - Docker Actions that change often should be separated and moved lower in the order,
#     to speed up build times (e.g. copying app code)
# - Docker Actions that change rarely should be combined to reduce layers,
#     which speeds up deploy times (e.g. setting ENV VARS)

FROM picobit/triggeriq-base:latest

# ENV VARS are loaded in a single line to reduce number of images

USER root
WORKDIR /app
CMD ["python", "-u", "worker.py", "-c", "5"]
EXPOSE 5000
