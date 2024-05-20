import datetime

# Get the current Time
def getCurrentTime():
    return datetime.datetime.now()

# Add a time to the current time
def addTimeToCurrentTime(time, seconds = 0, minutes = 0, hours = 0, days = 0):
    return time + datetime.timedelta(seconds=seconds, minutes=minutes, hours=hours, days=days)