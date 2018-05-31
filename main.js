
// formatting request URL
var ORIGIN = "https://www.googleapis.com/civicinfo/v2/representatives";
var GOOGLE_API_KEY = "?key=AIzaSyBexCRxO-UEa8lZ_VI3ZGf0WnpN8B54zbI";
var ADDRESS = "&address=";
var MISSING_ADDRESS = ORIGIN + GOOGLE_API_KEY + ADDRESS;
var TIMES_API_KEY = "6e833b98f0e7467cb50d457c125f6838";
const TWITTERURL = "https://publish.twitter.com/oembed?url=https://twitter.com/";
const TWITTERTHEME = "&theme=dark";
const TWITTERLIMT = "&limit=12"

// declare variables for form input elements
var $addressForm = $("[data-input='address-form']");
var $street = $("[data-input='street']");
var $city = $("[data-input='city']");
var $state = $("[data-input='state']");
var $dataDiv = $("[data-show]");

// attach event listener for submitting the address form
$addressForm.on("submit", function(event) {
    event.preventDefault();
    var formattedAddress = formatAddress($street.val(), $city.val(), $state.val());

    var userAddress = {
        street: $street.val(),
        city: $city.val(),
        state: $state.val()
    };

    localStorage.setItem("userAddress", JSON.stringify(userAddress));

    var ajaxRequest = $.get(MISSING_ADDRESS + formattedAddress, function(data) {
        localStorage.setItem("repInfo", JSON.stringify(data));
    });

    ajaxRequest
        .then(getOfficials)

    // getOfficials();
});

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

function getOfficials () {
    var fullData = JSON.parse(localStorage.getItem("repInfo"));
    var $listOfficials = $("<div>");

    $listOfficials.addClass("list-officials");
    $listOfficials.attr("data-officials", "");

    //console.log(fullData.officials);
    fullData.officials.forEach(function(official, officialIndex) {
        // console.log(official);

        var $currentOfficial = $("<div>");
        $currentOfficial.addClass("official-box");
        $currentOfficial.attr("data-official-box", "");

        // append official's name
        appendName($currentOfficial, official.name);

        // append official's office title
        var officeName = getOfficeName(fullData.offices, officialIndex);
        appendTitle($currentOfficial, officeName);

        // append official's party
        appendParty($currentOfficial, official.party);

        // append website
        if (official.urls) {
            appendWebsite($currentOfficial, official);
        }

        // prepend photo
        prependPhoto($currentOfficial, official);

        // append Twitter Handle
        // var twitterHandle = getTwitterHandle($currentOfficial, official.channels);
        // // console.log(official.channels);
        // appendTwitterHandle($currentOfficial, twitterHandle);

        // append social media channels
        if (official.channels) {
            appendSocialMedia($currentOfficial, official.channels, officialIndex);
        }

        // append article search
        appendArticleSearch($currentOfficial, officialIndex);

        // append official-box to the list-officials div
        $listOfficials.append($currentOfficial);

    });

    // append completed list of officials to the $data-div
    // so that it displays on screen in its entirety
    $dataDiv.append($listOfficials);
}

// helper functions for adding individual pieces of data
// to the official-box

function getOfficeName(arrayOfOffices, officialIndex) {
    // console.log(arrayOfOffices);
    var results = "";
    
    arrayOfOffices.forEach(function(office, officeIndex) {
        //console.log("indices: " + office.officialIndices + "name: " + office.name);
            
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
    $newDiv.text(text);
    currentOfficial.append($newDiv);
}

function appendTwitterHandle(currentOfficial, handle) {
    //console.log(handle);
    var $newDiv = $("<div>");
    $newDiv.attr("data-twitter", "");
    $newDiv.text(handle);
    currentOfficial.append($newDiv);
}

function appendSocialMedia(currentOfficial, channels, index) {
    var $socialContainer = $("<div>");
    $socialContainer.attr("data-social-" + index, "");
    $socialContainer.text("Social Media");
    
    var $socialContents = $("<div>");
    $socialContents.addClass("hidden");

    channels.forEach(function(channel) {
        var $newChannel = $("<div>");
        $newChannel.text(channel["type"] + ": " + channel["id"]);
        // console.log(channel);
        $socialContents.append($newChannel);
        $socialContainer.append($socialContents);
    });

    currentOfficial.append($socialContainer);
}

function getTwitterHandle(currentOfficial, channels) {
    results = "";
    
    if (channels) {
        results = "";
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
    var $newAnchor = $("<a>");
    $newDiv.append($newAnchor);
    $newAnchor.attr("data-article-search", "");
    $newAnchor.attr("href", searchUrl);
    $newAnchor.attr("target", "_blank");
    $newAnchor.text("NY Times Article Search");
    currentOfficial.append($newDiv);
}

function appendWebsite(currentOfficial, item) {
    // var $urls = $("<div>");
    // var $websites = $("<div>");
    // $urls.append($websites);
    // $websites.text("Website:");
    // item.urls.forEach(function (subItem) {
    //     var $websiteAnchor = $("<a>");
    //     $websiteAnchor.attr("href", subItem);
    //     $websiteAnchor.attr("target", "_blank");
    //     $websiteAnchor.text(subItem);
    //     $urls.append($websiteAnchor);
    // });

    var $urls = $("<div>");
    var $website = $("<a>");
    $urls.append($website);
    $website.text("Website");

    $website.attr("href", item.urls[0]);
    $website.attr("target", "_blank");
    /*
    item.urls.forEach(function (subItem) {
        var $websiteAnchor = $("<a>");
        $websiteAnchor.attr("href", subItem);
        $websiteAnchor.attr("target", "_blank");
        $websiteAnchor.text(subItem);
        $urls.append($websiteAnchor);
    });
    */

    currentOfficial.append($urls);
}

function prependPhoto(currentOfficial, item) {
    
    if (item.photoUrl) {

        var $imageUrl = $("<a>");
        var $image = $("<img>");
        $imageUrl.addClass("official-imageUrl");
        $image.addClass("official-image");
        $imageUrl.append($image);
        
        $imageUrl.attr("href", item.photoUrl);
        $image.attr("src", item.photoUrl);
        currentOfficial.prepend($imageUrl);

    } else {

        var $imageUrl = $("<a>");
        var $image = $("<img>");
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
        currentOfficial.prepend($imageUrl);

    }
}

function getArticleSearchUrl(name, title) {
    // console.log(name);
    var names = name.split(" ");
    var formattedName = names.join("+");

    var titles = title.split(" ");
    var formattedTitle = titles.join("+");

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + "q=" + formattedName + /*"+" + formattedTitle +*/ "&api-key=" + TIMES_API_KEY; //+ "&sort=newest"
    return url;
}

function getTwitterUrl(twitterhandle) {
    var styledURL = TWITTERURL + twitterhandle + TWITTERTHEME + TWITTERLIMT;
    $.get(styledURL, function (data) {
        var embeddedTimeline = $(data.html);
        return embeddedTimeline;
    })};

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