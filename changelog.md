# Changelog

### v0.1.1

* added a new component to handle unknown route requests
* set up continuous integration with Heroku deployments

### v0.1.0

* **bug fix** do not stop a video with timeout if user initiated playback with youtube player controls
* **bug fix** stopped zombie playback of playing/looping segment that was deleted
* **bug fix** improved `Segment.id` assignment, so we don't have duplicates

### v0.0.4

* **bug fix** allowed new segments to be saved (again)
* **bug fix** correctly set the video id in the youtube player
* improved the youtube url regexes for finding video ids
* added base styles for inputs, labels, buttons, links, global styles, and view layouts

### v0.0.3

* **bug fix** if a user has manipulated their LocalStorage, still allow app to load

### v0.0.2

* added functionality to remove segments from a song
* added an additional `id` attribute to Segments for identification
* removed the edit button from the segment view until the functionality is added

### v0.0.1

* achieved a super simple version of the app, with no styles
