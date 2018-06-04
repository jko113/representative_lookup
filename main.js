
// formatting request URL
var ORIGIN = "https://www.googleapis.com/civicinfo/v2/representatives";
var GOOGLE_API_KEY = "?key=AIzaSyBexCRxO-UEa8lZ_VI3ZGf0WnpN8B54zbI";
var ADDRESS = "&address=";
var MISSING_ADDRESS = ORIGIN + GOOGLE_API_KEY + ADDRESS;
var TIMES_API_KEY = "6e833b98f0e7467cb50d457c125f6838";
const PROXYURL = `http://my-little-cors-proxy.herokuapp.com/`;
const TWITTERURL = "https://publish.twitter.com/oembed?url=https://twitter.com/";
const TWITTERTHEME = "&theme=dark";
const TWITTERLIMIT = "&limit=12"

// declare variables for form input elements
var $addressForm = $("[data-input='address-form']");
var $street = $("[data-input='street']");
var $city = $("[data-input='city']");
var $state = $("[data-input='state']");
var $dataDiv = $("[data-show]");
var $formDiv = $("[data-form-container");
var $hamburgerButton = $("[data-hamburger-menu]");
var $hamburgerDropDown = $("[data-hamburger-dropdown]")

// attach event listener for submitting the address form
$addressForm.on("submit", function(event) {
    event.preventDefault();
    var formattedAddress = formatAddress($street.val(), $city.val(), $state.val());

    //shrink video player on address submit to show main contents
    $formDiv.removeClass("form-outer-container");
    $formDiv.addClass("form-outer-container-search");

    var userAddress = {
        street: $street.val(),
        city: $city.val(),
        state: $state.val()
    };

    localStorage.setItem("userAddress", JSON.stringify(userAddress));

    // var ajaxRequest = $.get(MISSING_ADDRESS + formattedAddress, function(data) {
    //     localStorage.setItem("repInfo", JSON.stringify(data));
    // });

    // ajaxRequest
    //     .then(getDivisions)

    getDivisions();
    //getOfficials();
});

$addressForm.on("reset", function(event) {
    // event.preventDefault();

    $formDiv.addClass("form-outer-container");
    $formDiv.removeClass("form-outer-container-search");
    clearOfficials();
    clearDivisions();

})

$hamburgerButton.on("click", function(event) {
    $hamburgerDropDown.toggleClass('hidden');
    // $hamburgerDropDown.toggleClass('hamburger-dropdown');
})

function formatAddress(unformattedAddress, unformattedCity, unformattedState) {
    var streets = unformattedAddress.split(" ");
    var cities = unformattedCity.split(" ");
    var states = unformattedState.includes(" ") ? unformattedState.split(" ") : [unformattedState];

    var results = "";

    streets.forEach(function (item, index) {
        if (index === 0) {
            results += item;
        } else {
            results += "%20" + item;
        }
    });

    cities.forEach(function (item) {
        results += "%20" + item;
    });

    states.forEach(function(item) {
        results += "%20" + item;
    });

    return results;
}

function getDivisions() {
    // clear out officials and divisions from content area, if present
    clearOfficials();
    clearDivisions();

    var fullData = JSON.parse(localStorage.getItem("repInfo"));
    var $listDivisions = $("<div>");
    $listDivisions.addClass("button-container");
    var divisions = fullData.divisions;

    appendAllOfficialsButton(fullData, $listDivisions);

    Object.keys(divisions).forEach(function(division) {
        var $newDivisionButton = $("<button>");
        $newDivisionButton.text(divisions[division]["name"]);
        $newDivisionButton.addClass("division-button");
        var offices = divisions[division]["officeIndices"];
        
        if (offices && offices.length) {
            addDivisionListener($newDivisionButton, offices);
            $listDivisions.append($newDivisionButton);
        }
    });

    $dataDiv.append($listDivisions);

}

function appendAllOfficialsButton(dataset, listDivisions) {
    var $allOfficialsButton = $("<button>");
    $allOfficialsButton.text("All");
    $allOfficialsButton.addClass("division-button");

    var allOfficesArray = [];

    // console.log(Object.keys(dataset.offices));
    dataset.offices.forEach(function(office, officeIndex) {
        allOfficesArray.push(officeIndex);
    });

    addDivisionListener($allOfficialsButton, allOfficesArray);
    listDivisions.append($allOfficialsButton);
}

function addDivisionListener(button, officeArray) {
    button.on("click", function(event) {
        event.preventDefault();

        var offices = [];
        var officials = [];
        
        offices = getOffices(officeArray);
        officials = getOfficialsByOffice(offices);
        getOfficials(officials);

    });
}

function getOffices(officeArray) {

    var fullData = JSON.parse(localStorage.getItem("repInfo"));
    // var offices = fullData.offices.filter(isValidOffice);
    var offices = [];

    fullData.offices.forEach(function(office, officeIndex) {

        officeArray.forEach(function(trimmedOffice) {
            if (officeIndex === trimmedOffice) {
                // console.log("officeIndex: " + officeIndex + " trimmedOffice: " + trimmedOffice);
                offices.push(office);

            }
        });
    });

    return offices;
}

function getOfficialsByOffice(filteredOfficeArray) {
    var fullData = JSON.parse(localStorage.getItem("repInfo"));
    var officials = [];

    fullData.officials.forEach(function(official, officialIndex) {

        filteredOfficeArray.forEach(function(office, officeIndex) {
            if (office["officialIndices"].includes(officialIndex)) {

                official["officialIndex"] = officialIndex;
                officials.push(official);
            }
        });
    });

    return officials;
}

/*
function isValidOffice (officeArray) {
    var fullData = JSON.parse(localStorage.getItem("repInfo"));
    // return Object.keys(fullData.offices).includes(officeArray.values());
}
*/

function getOfficials (officialsArray) {
    // clear out officials from content area, if present
    clearOfficials();

    // have full data set available for grabbing office name (i.e., title/position)
    var fullData = JSON.parse(localStorage.getItem("repInfo"));
    var $listOfficials = $("<div>");

    // create new official list div to contain the officials at
    // the selected level of government
    $listOfficials.addClass("list-officials");
    $listOfficials.attr("data-officials", "");

    // loop through each official in the filtered list,
    // add all the relevant details,
    // and finally append each one to the content div 
    officialsArray.forEach(function(official, officialIndex) {

        // div to contain the individual official
        var $currentOfficial = $("<div>");
        $currentOfficial.addClass("official-box");
        $currentOfficial.attr("data-official-box", "");

        // append official's name
        appendName($currentOfficial, official.name);

        // append official's office title
        var officeName = getOfficeName(fullData.offices, official["officialIndex"]);
        appendTitle($currentOfficial, officeName);

        // append official's party
        appendParty($currentOfficial, official.party);

        // append website
        if (official.urls) {
            appendWebsite($currentOfficial, official);
        }

        // prepend photo
        prependPhoto($currentOfficial, official);

        // append social media channels
        if (official.channels) {
            appendSocialMedia($currentOfficial, official.channels, officialIndex);
        }

        // append article search
        appendArticleSearch($currentOfficial, officialIndex);

        // append official-box to the list-officials div
        $listOfficials.append($currentOfficial);

    });

    // append completed list of filtered officials to the $data-div
    // so that it displays on screen in its entirety
    $dataDiv.append($listOfficials);
}

function clearOfficials() {
    $(".official-box").remove();
    $(".list-officials").remove();
}

function clearDivisions() {
    $(".button-container").remove();
    $(".division-button").remove();
}

// helper functions for adding individual pieces of data
// to the official-box

function getOfficeName(arrayOfOffices, officialIndex) {
    
    var results = "";
    
    arrayOfOffices.forEach(function(office, officeIndex) {
            
        if (office.officialIndices && office.officialIndices.includes(officialIndex)) {
            results = office.name;
        }
    });
    
    return results;
}

function appendName(currentOfficial, text) {
    var $newDiv = $("<div>");
    $newDiv.attr("data-name", "");
    $newDiv.text(text);
    currentOfficial.append($newDiv);
}

function appendTitle(currentOfficial, text) {
    var $newDiv = $("<div>");
    $newDiv.attr("data-title", "");
    $newDiv.text(text);
    currentOfficial.append($newDiv);
}

function appendParty(currentOfficial, text) {
    var $newDiv = $("<div>");
    $newDiv.attr("data-party", "");

    if (text === "Unknown") {
        $newDiv.text("Party: " + text);
    } else  {
        $newDiv.text(text);
    }
    currentOfficial.append($newDiv);
}

function appendTwitterHandle(currentOfficial, handle) {
    var $newDiv = $("<div>");
    $newDiv.attr("data-twitter", "");
    $newDiv.text(handle);
    currentOfficial.append($newDiv);
}

function appendSocialMedia(currentOfficial, channels, index) {
    var $socialContainer = $("<div>");
    var $socialContainerLink = $("<a>");
    $socialContainerLink.attr("href", "#");
    $socialContainerLink.attr("data-social-anchor", index);
    $socialContainerLink.text("Social Media");
    $socialContainer.append($socialContainerLink);

    addSocialListener($socialContainerLink, index);
    
    var $socialContents = $("<div>");
    $socialContents.attr("data-social", index);
    $socialContents.addClass("hidden");

    channels.forEach(function(channel) {
        var $newChannel = $("<div>");
        var $newChannelLink = $("<a>");
        var channelPrefix = "";
        if (channel["type"] === "Twitter") {
            channelPrefix = checkSocialType(channel);
            $newChannelLink.text(channel["type"]);
            $newChannelLink.attr({href: channelPrefix, target: "_blank", overflow: "scroll"});
            $newChannelLink.attr("data-embeddedTwitter","");
            createTwitterListener($newChannelLink, channel["id"]);
        }
        else {
            channelPrefix = checkSocialType(channel);
            $newChannelLink.text(channel["type"]);
            $newChannelLink.attr({href: channelPrefix, target: "_blank"});
        }
        $newChannel.append($newChannelLink);
        $socialContents.append($newChannel);
        $socialContainer.append($socialContents);
    });

    currentOfficial.append($socialContainer);
}

function checkSocialType(channel) {
    if (channel["type"] === "Facebook") {
        return `https://facebook.com/` + channel["id"];
    }
    else if (channel["type"] === "YouTube") {
        return `https://youtube.com/` + channel["id"];
    }
    else if (channel["type"] === "GooglePlus") {
        return `https://plus.google.com/` + channel["id"];
    }
    else if (channel["type"] === "Twitter") {
        return `https://twitter.com/` + channel["id"];
    }
}

function createTwitterListener(link, channel) {
    link.on('click', function (event) {
        event.preventDefault();
        getTwitterUrl(channel)
            .then(function (data) {
                embeddedTimeLine = data.html;
                link.append(embeddedTimeLine);
                link.css("overflow-y","scroll");
                link.off();
            })
    })
}

function getTwitterUrl(twitterhandle) {
    var styledURL = PROXYURL + TWITTERURL + twitterhandle + TWITTERTHEME + TWITTERLIMIT;
    return $.get(styledURL, function (data) {
    })
}

function addSocialListener(socialContainerLink, index) {
    socialContainerLink.on("click", function(event) {
        event.preventDefault();
        var formatHiddenSocialDiv = "[data-social='" + index + "']"
        var $hiddenSocialDiv = $(formatHiddenSocialDiv);

        if ($hiddenSocialDiv.hasClass("hidden")) {
            $hiddenSocialDiv.removeClass("hidden");
            $hiddenSocialDiv.addClass("social-popup");
            var popper = new Popper(socialContainerLink, $hiddenSocialDiv, {
                placement: "top"
            });
        } else {
            $hiddenSocialDiv.addClass("hidden");
            $hiddenSocialDiv.removeClass("social-popup");
        }      
    });

    // socialContainerLink.on("focusout", function(event) {
    //     event.preventDefault();
    //     var formatHiddenSocialDiv = "[data-social='" + index + "']"
    //     var $hiddenSocialDiv = $(formatHiddenSocialDiv);

    //     if (!$hiddenSocialDiv.hasClass("hidden")) {
    //         $hiddenSocialDiv.addClass("hidden");
    //         $hiddenSocialDiv.removeClass("social-popup");
    //     } 
    //     // console.log("focused out");
    // });
}

function getTwitterHandle(currentOfficial, channels) {
    results = "";
    
    if (channels) {
        channels.forEach(function(item) {
            if (item["type"] === "Twitter") {
                results = item["id"];
            }
        });
    }
    return results;
}

function appendArticleSearch(currentOfficial, index) {
    
    var officialName = currentOfficial.find("[data-name]");
    var officialTitle = currentOfficial.find("[data-title]");
    var searchUrl = getArticleSearchUrl(officialName.text(), officialTitle.text());

    var $newDiv = $("<div>");
    $newDiv.addClass("times-div");
    var $newAnchor = $("<a>");
    $newDiv.append($newAnchor);
    $newAnchor.attr("data-article-search-" + index, searchUrl);

    addArticleListener($newAnchor, index);

    $newAnchor.attr("href", "#");
    $newAnchor.attr("target", "_blank");
    $newAnchor.text("NY Times Article Search");
    
    var $articleContent = $("<div>");
    $articleContent.attr("data-articles-" + index, "");
    $articleContent.addClass("hidden");
    var $articlePopup = $("<div>");
    $articlePopup.attr("data-article-popup-" + index, "");
 
    $newDiv.append($articleContent);
    $articleContent.append($articlePopup);

    currentOfficial.append($newDiv);
}

function addArticleListener(anchor, index) {
    anchor.on("click", function(event) {

        event.preventDefault();
        $articleDiv = $("[data-articles-" + index + "]");
        var requestUrl = anchor[0].dataset["articleSearch-" + index];

        if ($articleDiv.hasClass("hidden")) {

            $articleDiv.removeClass("hidden");
            $articleDiv.addClass("article-popup");
            var popper = new Popper(anchor, $articleDiv, {
                placement: "top"
            });

            $.get(requestUrl)
                .then(storeArticles)
                .then(populateArticlePopup)
        } else {
            $articleDiv.removeClass("article-popup");
            $articleDiv.addClass("hidden");
        }
        

    });
}

function populateArticlePopup(index) {
    var articles = JSON.parse(localStorage.getItem("Times"));
    var $articlePopup = $(".article-popup");
    $articlePopup.empty();

    if (articles.length) {
        articles.forEach(function(article) {
            $newArticle = $("<div>");
            var $newArticleLink = $("<a>");
            $newArticleLink.attr({href: article["web_url"], target: "_blank"});
    
            var headline = article["headline"]["main"]
            if (headline.length > 25) {
                headline = headline.slice(0,25) + "...";
            }
            $newArticleLink.text(headline);
            $articlePopup.append($newArticle);
            $newArticle.append($newArticleLink);
        });
    } else {
        var $noArticle = $("<div>")
        $noArticle.text("No articles found.");
        $articlePopup.append($noArticle);
    }
}

function storeArticles(data) {
    if (data.response["docs"]) {
        localStorage.setItem("Times", JSON.stringify(data.response["docs"]));
    }
}

function appendWebsite(currentOfficial, item) {

    var $urls = $("<div>");
    var $website = $("<a>");
    $urls.append($website);
    $website.text("Website");

    $website.attr("href", item.urls[0]);
    $website.attr("target", "_blank");

    currentOfficial.append($urls);
}

function prependPhoto(currentOfficial, item) {
    
    if (item.photoUrl) {

        var $imageUrl = $("<a>");
        var $image = $("<img>");
        var $imageContainer = $("<div>")
        $imageUrl.addClass("official-imageUrl");
        $image.addClass("official-image");
        $imageUrl.append($image);
        
        $imageUrl.attr("href", item.photoUrl);
        $image.attr("src", item.photoUrl);
        $imageContainer.append($imageUrl)
        $imageContainer.addClass("official-imageUrl-container");
        currentOfficial.prepend($imageContainer);

    } else {

        var $imageUrl = $("<a>");
        var $image = $("<img>");
        var $imageContainer = $("<div>")
        $imageUrl.addClass("official-imageUrl");
        $imageUrl.attr("target", "_blank");
        $image.addClass("no-official-image");
        $imageUrl.append($image);

        var formattedName = ""
        var tempVariable = item.name.split(" ");
        tempVariable.forEach(function(word, index) {
            if (index === 0) {
                formattedName += word;
            } else {
                formattedName += "%20" + word;
            }
        });
        $imageUrl.attr("href", "https://www.google.com/search?tbm=isch&q=" + formattedName);
        $image.attr("src", "images/no-image-available.jpg");
        $imageContainer.append($imageUrl);
        $imageContainer.addClass("official-imageUrl-container");
        currentOfficial.prepend($imageContainer);

    }
}

function getArticleSearchUrl(name, title) {

    var names = name.split(" ");
    var formattedName = names.join("+");

    var titles = title.split(" ");
    var formattedTitle = titles.join("+");

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + "q=" + formattedName + /*"+" + formattedTitle +*/ "&api-key=" + TIMES_API_KEY; //+ "&sort=newest"
    return url;
}

// function to load page with previously stored address data (if available)
function loadPage () {
    var userAddress = JSON.parse(localStorage.getItem("userAddress"));

    if (userAddress) {
        // console.log(userAddress);
        if (userAddress.street) {
            $street.val(userAddress.street);
        }

        if (userAddress.city) {
            $city.val(userAddress.city);
        }

        if (userAddress.state) {
            $state.val(userAddress.state);
        }
    }
}

loadPage();