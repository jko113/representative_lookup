# RepSearch

## Description

RepSearch is an application for obtaining information about elected officials in a given constituency. After entering a physical U.S. address, government officials at the local, state and national levels appear on-screen, complete with a photo (if available) and details about rank, party affiliation, associated website and news articles, as well as social media presence.

[![Main functionality](https://raw.githubusercontent.com/jko113/repsearch/master/images/main.gif)](https://www.youtube.com/watch?v=-3jyz42O0Kk)
<br>
[![Responsiveness](https://raw.githubusercontent.com/jko113/repsearch/master/images/responsiveness.gif)](https://www.youtube.com/watch?v=-3jyz42O0Kk)
<br>
[![Social Media](https://raw.githubusercontent.com/jko113/repsearch/master/images/social-media.gif)](https://www.youtube.com/watch?v=-3jyz42O0Kk)

<a href="https://www.youtube.com/watch?v=-3jyz42O0Kk" target="blank">Click here for the full RepSearch demo!</a>

## Technologies

The application is built using HTML, CSS and JavaScript/JQuery and incorporates three public APIs:

* [Google Civic Information](https://developers.google.com/civic-information/)
* [Twitter Embedded Timelines](https://dev.twitter.com/web/embedded-timelines)
* [New York Times Article Search](http://developer.nytimes.com/article_search_v2.json)

## Special Features

* The Google Civic Information API is not a complete data set. As such, many local officials' images are not stored. To remedy this, users can click the "No Image Available" icon and redirect to a Google image search of that official's name.

* The default search yields officials at all levels of government. After submitting a valid address, it is possible to filter search results based on the level of government (or ["OCD identifier"](http://opencivicdata.readthedocs.io/en/latest/proposals/0002.html)).

## Motivation

As engaged citizens (and more-than-occasional listeners of NPR), we deemed it prudent to create an app that makes it easy it find out who your local officials are. We admit that including the Twitter feed was inspired by the current president's penchant for this pithy platform.

## Possible Limitations (or areas for improvement)

* In our testing, the NY Times article search did not prove 100% reliable in the way of yielding germane results, particularly for lower-level officials. This is likely because the API's search algorithm doesn't require that a first and last name be contiguous in the news article, so that searching for "John Miller" might come up with an article containing the names John Jones and Manny Miller. A future improvement to the application would be to further research the API's capabilities to ensure that its search feature is utilized as effectively as possible to limit unrelated results.

* A helpful UI improvement would be to allow only one popup menu to be open at a time, ideally by activating a listener on the document that intelligently handles user behavior, closing any open popup if the user clicks outside the menu or presses the escape key.

* A secondary UI modification would be better handling non-standard image sizes.

## Screenshots

#### The main search screen
![Search](https://raw.githubusercontent.com/jko113/repsearch/master/images/search.png)

#### The list of results with tabs at the top for filtering levels
![Image Search](https://raw.githubusercontent.com/jko113/repsearch/master/images/image%20search.png)

#### The embedded Twitter timeline
![Embedded Timeline](https://raw.githubusercontent.com/jko113/repsearch/master/images/tweets.png)

#### The About page
![About](https://raw.githubusercontent.com/jko113/repsearch/master/images/about.png)

#### Responsive Design
![About](https://raw.githubusercontent.com/jko113/repsearch/master/images/responsive.png)
