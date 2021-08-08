let cacheArray = [];
let moreInfoArray = new Map();
let coinsModalArray = [];
let checkboxDetails = [];
let coinsModalArrayUpdated = [];
(function () {

    $(function () {

        const mainUrl = "https://api.coingecko.com/api/v3/coins";

        const priceUrl = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";

        const listUrl = mainUrl + "/list";

        let coinsContainer = $(".mainContainer");

        // check if the cache is full or empy
        checkIfCacheIsFull();

        // check if cache is full so you can use it 
        function checkIfCacheIsFull() {
            if (cacheArray.length == 0) {
                getDataFromServer();
            } else {
                showAllCoins(cacheArray);
            }
        }


/**********************      API’s CALL OPTION A    ********************************/
        //get all coins from server to show on coins container
        function getDataFromServer() {
            $.get(mainUrl)
                .then(function (coins) {
                    cacheArray = coins.slice(0, 100); //You can remove the slice limit
                    for(i = 0; i < cacheArray.length; i++){
                        cacheArray[i].symbol = cacheArray[i].symbol.toLowerCase();
                    }
                    showAllCoins(cacheArray);
                    console.log("This is the list of all the coins that been loaded..")
                    console.log(cacheArray);
                })
                .catch((error) => console.log(error));
        }  
        
        

/**********************      API’s CALL OPTION B    ********************************///
        // //get all coins from server to show on coins container
        // function getDataFromServer() {
        //     $.get(listUrl)
        //         .then(function (coins) {
        //             cacheArray = coins.slice(0, 100); //You can remove the slice limit
        //             for(i = 0; i < cacheArray.length; i++){
        //                 cacheArray[i].symbol = cacheArray[i].symbol.toLowerCase();
        //             }
        //             showAllCoins(cacheArray);
        //             console.log("This is the list of all the coins that been loaded..")
        //             console.log(cacheArray);
        //         })
        //         .catch((error) => console.log(error));
        // }

        // show all coins on the dom 
        function showAllCoins(coins) {
            clearData();

            for (let coin of coins) {
                let card = createCardDiv();
                let cardBody = createCradBody(card);
                let nameCheck = createNameCheck(cardBody);
                let checkboxSwitch = createCheckboxSwitch(nameCheck);
                let inputCheckbox = createInputCheckbox(coin, checkboxSwitch);

                if (coinsModalArray.includes(coin.symbol)) {
                    inputCheckbox.attr("checked", "checked");
                    }
                let spanCheckbox = createSpanCheckbox(checkboxSwitch);
                let coinSymbol = createCoinSymbol(coin, nameCheck);
                let coinName = createCoinName(coin, cardBody);
                let readMore = createReadMore(coin, cardBody);

                readMore.click(function (event) {
                    getMoreInfoFromServer(event.target.id);
                });

                let moreInfo = createMoreInfo(coin, cardBody);
                let moreInfoSpinner = createMoreInfoSpinner(coin, moreInfo);

                $(".loadingContainer").hide();
            }

            moreLess();
        }

        function createCardDiv() {
            let card = $("<div>");
            card.addClass("card");
            coinsContainer.append(card);
            return card;
        }

        function createCradBody(card) {
            let cardBody = $("<div>");
            cardBody.addClass("card-body");
            card.append(cardBody);
            return cardBody;
        }

        function createNameCheck(cardBody) {
            let nameCheck = $("<div>");
            nameCheck.addClass("nameCheck");
            cardBody.append(nameCheck);
            return nameCheck;
        }

        function createCheckboxSwitch(nameCheck) {
            let checkboxSwitch = $("<label>");
            checkboxSwitch.addClass("switch");
            nameCheck.append(checkboxSwitch);
            return checkboxSwitch;
        }

        function createInputCheckbox(coin, checkboxSwitch) {
            let inputCheckbox = $("<input>");
            inputCheckbox.attr("type", "checkbox");
            inputCheckbox.attr("id", coin.symbol);
            inputCheckbox.attr("data-toggle", "modal");
            inputCheckbox.attr("data-target", "#exampleModal");
            inputCheckbox.click(countCheckedCkeckbox);
            checkboxSwitch.append(inputCheckbox);
            return inputCheckbox;
        }

        function createSpanCheckbox(checkboxSwitch) {
            let spanCheckbox = $("<span>");
            spanCheckbox.addClass("slider");
            checkboxSwitch.append(spanCheckbox);
            return spanCheckbox;
        }

        function createCoinSymbol(coin, nameCheck) {
            let coinSymbol = $("<h4>");
            coinSymbol.addClass("card-text");
            coinSymbol.html(coin.symbol);
            nameCheck.append(coinSymbol);
            return coinSymbol;
        }

        function createCoinName(coin, cardBody) {
            let coinName = $("<p>");
            coinName.addClass("card-text-name");
            coinName.html(coin.name);
            cardBody.append(coinName);
            return coinName;
        }

        function createReadMore(coin, cardBody) {
            let readMore = $("<button>More Info</button>");
            readMore.attr("class", "btnChanger");
            readMore.addClass("btn btn-primary");
            readMore.attr("type", "button");
            readMore.attr("id", coin.id);
            readMore.attr("data-toggle", "collapse");
            readMore.attr("data-target", "#details" + coin.id);
            cardBody.append(readMore);
            return readMore;
        }

        function createMoreInfo(coin, cardBody) {
            let moreInfo = $("<div>");
            moreInfo.addClass("collapse");
            moreInfo.attr("id", "details" + coin.id);
            cardBody.append(moreInfo);
            return moreInfo;
        }

        function createMoreInfoSpinner(coin, moreInfo) {
            let moreInfoSpinner = $("<span>");
            moreInfoSpinner.addClass("moreSpinner");
            moreInfoSpinner.attr("id", "details" + coin.id);
            moreInfo.append(moreInfoSpinner);
            return moreInfoSpinner;
        }

        // check if the items from more info has been cached already so you can use it
        function getMoreInfoFromServer(id) {
            if (!moreInfoArray.has(id)) {
                getMoreInfoDataFromServer(id);
            }
            else {
                getMoreInfoFromCache(id);
            }
        }

        function getMoreInfoFromCache(coinId) {
            let coinMoreInfo = moreInfoArray.get(coinId);
            updateMoreInfo(coinMoreInfo, coinId);
        }

        // show all coins on the card 
        function moreLess() {
            $(".btnChanger").click(function () {
                let btnChanger = $(this);
                btnChanger.toggleClass("btnChanger");
                if (btnChanger.hasClass("btnChanger")) {
                    btnChanger.text("More Info");
                    console.log("You closed coin more information..");
                } else {
                    btnChanger.text("Less Info");
                    console.log("You opend coin more information..");
                }
            });
        }

        //get the item from server to show on more info section, and save (cache) them for 2 minutes
        function getMoreInfoDataFromServer(id) {
            $.get(mainUrl + "/" + id)
                .then(function (moreInfo) {
                    updateMoreInfo(moreInfo, id);
                    moreInfoArray.set(id, moreInfo);
                    setTimeout(function () {
                        moreInfoArray.delete(id);
                    }, 120000);
                })
                .catch((error) => console.log(error));
        }

        // those items will appear on the more info section by request
        function updateMoreInfo(moreInfo, id) {
            let coinImage = moreInfo.image.small;
            let coinUSDPrice = moreInfo.market_data.current_price.usd;
            let coinEURPrice = moreInfo.market_data.current_price.eur;
            let coinILSPrice = moreInfo.market_data.current_price.ils;

            let content = $("#details" + id);

            content.html(
                "USD Price is : " +
                " $ " + coinUSDPrice +
                "<br>" + "EUR Price Is :" +
                " € " + coinEURPrice +
                "<br>" + "ILS Price is :" +
                " ₪ " + coinILSPrice + "<br>"
            );

            let image = $("<img>");
            image.addClass("coinImage");
            image.attr("src", coinImage);
            content.append(image);
        }

        // start to count checked checkboxs
        function countCheckedCkeckbox(e) {
            let currentCheckbox = $(this);
            let currentCheckboxSymbol = currentCheckbox[0].id;
            setCheckboxState(currentCheckbox, currentCheckboxSymbol);
            checkCheckboxLimit();
        }

        // set limit to count checked checkboxs up to 5 
        function checkCheckboxLimit() {
            if (coinsModalArray.length > 5) {
                for (let i = 0; i < coinsModalArray.length; i++) {
                    let detailedCheckboxInfo = cacheArray.find(
                        (val) => val.symbol == coinsModalArray[i]
                    );
                    checkboxDetails[i] = detailedCheckboxInfo;
                }
                coinsModalArrayUpdated = coinsModalArray.slice();
                showOnModal();
                
            }
        }

        // keep checked checkbox till reset
        function setCheckboxState(currentCheckbox, currentCheckboxSymbol) {
            if (currentCheckbox.is(":checked") && coinsModalArray.length < 6) {
                currentCheckbox.attr("checked", "checked");
                coinsModalArray.push(currentCheckboxSymbol);
                console.log("You list now have..");
                console.log(coinsModalArray);
            } else {
                console.log(coinsModalArray);
                console.log("You just removed a coin from your list..");
                let coinIndexToRemove = coinsModalArray.indexOf(currentCheckboxSymbol);
                console.log(coinIndexToRemove);
                coinsModalArray.splice(coinIndexToRemove, 1);
                console.log(coinsModalArray);
            }
        }

        // clear the choosen coins 
        function resetModal() {
            clearData();
            checkIfCacheIsFull();
            coinsModalArray = [];
            saveModal();
            console.log("Your just cleard the modal..");
        }

        // save the choosen coins
        function saveModal() {
            if (coinsModalArray.length > 5) {
                alert("Please choose up to 5 coins");
            } else {
                console.log("Your final list is ready..");
                let filteredArray = coinsModalArrayUpdated.filter(
                    (element) => !coinsModalArray.includes(element)
                );
                let notFilteredArray = coinsModalArrayUpdated.filter((element) =>
                    coinsModalArray.includes(element)
                );
                showAllCoins(cacheArray);
                for (i = 0; i < notFilteredArray.length; i++) {
                    $("#" + notFilteredArray[i]).attr("checked", "checked");
                }
                for (i = 0; i < filteredArray.length; i++) {
                    $("#" + filteredArray[i]).attr("checked");
                }
                
            }
        }

        // clear data
        function clearData() {
            coinsContainer.empty();
            clearLiveGraph();
        }

        // open the modal and show all the choosen coins
        function showOnModal(coinId) {
            let modalDiv = createModalDiv();
            let modalDialog = createModalDialog(modalDiv);
            let modalContent = createModalContent(modalDialog);
            let modalHeader = createModalHeader(modalContent);
            let modalTitle = createModalTitle(modalHeader);
            let modalBody = createModalBody(modalContent);

            for (let i = 0; i < coinsModalArray.length; i++) {
                let modalCheckboxSwitch = createModalCheckboxSwitch(modalBody, i);
                let modalInputCheckbox = createModalInputCheckbox(modalCheckboxSwitch, i);
                let modalSpanCheckbox = createModalSpanCheckbox(modalCheckboxSwitch);
                let modalCoinSymbol = createModalCoinSymbol(modalBody, i);
            }

            let modalFooter = createModalFooter(modalContent);
            let modalClose = createModalClose(modalFooter);

            modalClose.click(function (event) {
                resetModal(event.target.close);
            });

            let modalSave = createModalSave(modalFooter);

            modalSave.click(function (event) {
                saveModal(event.target.save);
            });

            $("#myModal").modal({ backdrop: "static", keyboard: false });
        }

        function createModalDiv() {
            let modalDiv = $("<div>");
            modalDiv.addClass("modal fade show");
            modalDiv.attr("id", "myModal");
            modalDiv.attr("tabindex", "-1");
            modalDiv.attr("role", "dialog");
            modalDiv.attr("aria-labelledby", "myModalLabel");
            modalDiv.attr("aria-hidden", "true");
            coinsContainer.append(modalDiv);
            return modalDiv;
        }

        function createModalDialog(modalDiv) {
            let modalDialog = $("<div>");
            modalDialog.addClass("modal-dialog");
            modalDialog.attr("role", "document");
            modalDiv.append(modalDialog);
            return modalDialog;
        }

        function createModalContent(modalDialog) {
            let modalContent = $("<div>");
            modalContent.addClass("modal-content");
            modalDialog.append(modalContent);
            return modalContent;
        }

        function createModalHeader(modalContent) {
            let modalHeader = $("<div>");
            modalHeader.addClass("modal-header");
            modalContent.append(modalHeader);
            return modalHeader;
        }

        function createModalTitle(modalHeader) {
            let modalTitle = $(
                "<h5>Choose only max of 5 coins to use on Live Raports</h5>"
            );
            modalTitle.addClass("modal-title");
            modalTitle.attr("id", "exampleModalLabel");
            modalHeader.append(modalTitle);
            return modalTitle;
        }

        function createModalBody(modalContent) {
            let modalBody = $("<div>");
            modalBody.addClass("modal-body");
            modalContent.append(modalBody);
            return modalBody;
        }

        function createModalCheckboxSwitch(modalBody, i) {
            let modalCheckboxSwitch = $("<label>");
            modalCheckboxSwitch.addClass("switch");
            modalCheckboxSwitch.attr(coinsModalArray[i]);
            modalBody.append(modalCheckboxSwitch);
            return modalCheckboxSwitch;
        }

        function createModalInputCheckbox(modalCheckboxSwitch, i) {
            let modalInputCheckbox = $("<input>");
            modalInputCheckbox.attr("type", "checkbox");
            modalInputCheckbox.attr("checked", "checked");
            modalInputCheckbox.attr("id", coinsModalArray[i]);
            modalInputCheckbox.click(countCheckedCkeckbox);
            modalCheckboxSwitch.append(modalInputCheckbox);
            return modalInputCheckbox;
        }

        function createModalSpanCheckbox(modalCheckboxSwitch) {
            let modalSpanCheckbox = $("<span>");
            modalSpanCheckbox.addClass("slider");
            modalCheckboxSwitch.append(modalSpanCheckbox);
            return modalSpanCheckbox;
        }

        function createModalCoinSymbol(modalBody, i) {
            let modalCoinSymbol = $("<h4>");
            modalCoinSymbol.addClass("card-text");
            modalCoinSymbol.html(coinsModalArray[i]);
            modalBody.append(modalCoinSymbol);
            return modalCoinSymbol;
        }

        function createModalFooter(modalContent) {
            let modalFooter = $("<div>");
            modalFooter.addClass("modal-footer");
            modalContent.append(modalFooter);
            return modalFooter;
        }

        function createModalClose(modalFooter) {
            let modalClose = $("<button>Reset</button>");
            modalClose.addClass("btn btn-secondary");
            modalFooter.append(modalClose);
            return modalClose;
        }

        function createModalSave(modalFooter) {
            let modalSave = $("<button>Save changes</button>");
            modalSave.addClass("btn btn-primary");
            modalSave.attr("type", "button");
            modalFooter.append(modalSave);
            return modalSave;
        }

        let chartSetTimelineFrame;

        function clearLiveGraph() {
            clearInterval(chartSetTimelineFrame);
            options.data = [];
            $("#chartContainer").remove();
        }

        // click to see to graph
        $("#liveBtn").click(function () {
            if (coinsModalArray.length > 5 || coinsModalArray.length < 1) {
                alert("Please select up to 5 coins");
                console.log("Please select up to 5 coins")
                return false;
            } else {
                
                clearData();
                clearAboutPage();
                let chartContainer = $("<div>");
                chartContainer.attr("id", "chartContainer");
                coinsContainer.append(chartContainer);
                createLiveGraphObject();
                console.log("You are watching the graph from the coins list...");
                chartSetTimelineFrame = setInterval(function () {
                    updateDataPoints();
                }, 2000);
            }
        });

        function displayAboutPage() {
            let aboutContainer = $(".aboutContainer");
            aboutContainer.css("display", "block");
            coinsContainer.css("display", "none");
        }

        function clearAboutPage() {
            let aboutContainer = $(".aboutContainer");
            aboutContainer.css("display", "none");
            coinsContainer.css("display", "flex");
        }

        // this is the home page button
        $("#homeBtn").click(function () {
            console.log("This is home page..")
            clearData();
            checkIfCacheIsFull();
            // saveModal();
            clearAboutPage();
            clearLiveGraph();
        });

        // this is the about page button
        $("#aboutBtn").click(function () {
            console.log("This is about page..")
            clearData();
            displayAboutPage();
            clearLiveGraph();
            // saveModal();
        });

        // input validation
        $("#userInput").mouseenter(function () {
            $(this).css("border", "");
        });

        // remove data
        function clearData() {
            coinsContainer.empty();
        }

        // search button to get the requierd coin
        $("#searchBtn").click(function () {
            let userInput = $("#userInput");
            let userInputVal = userInput.val().toLowerCase();
            console.log("You search for: " + userInputVal);

            let showFoundValue = cacheArray.filter(
                (index) => index.symbol == userInputVal
            );
          
            if (userInputVal.trim().length == 0 || showFoundValue == undefined) {
                alert("Please enter a coin ID");
                userInput.css("border", "2px red solid");
                userInput.val("");
                console.log("You need to enter a coin name");
            } else if(userInputVal.includes(showFoundValue) ){
                alert("No results found, Try again");
                userInput.css("border", "2px red solid");
                userInput.val("");
                console.log("Sorry, no match found for this search");
            } else {
                userInput.val("");
                clearAboutPage();
                clearData();
                showAllCoins(showFoundValue);
            }
        });

        // creat live graph with the choosen coins
        function createLiveGraphObject() {
            options.title.text = coinsModalArray + " to USD";
            $.get(priceUrl + coinsModalArray + "&tsyms=USD")
                .then(function (coinsData) {
                 for (let [key, value] of Object.entries(coinsData)) {
                 let dataObject = {
                    type: "spline",
                    name: key,
                    showInLegend: true,
                    xValueFormatString: "MMM YYYY",
                    yValueFormatString: "#,##0 USD",
                    dataPoints: [{ x: new Date(), y: value.USD }]
                }
                options.data.push(dataObject);
            }      
            $("#chartContainer").CanvasJSChart(options);
            })
            .catch(error => console.log(error));    
        }

        function updateDataPoints() {
            $.get(priceUrl + coinsModalArray + "&tsyms=USD")
            .then(function (coinsData) {
                for (let [key, value] of Object.entries(coinsData)) {
                for (let index = 0; index < options.data.length; index++) {
                    if (options.data[index].name == key) {
                    let dataPoints = { x: new Date(), y: value.USD };
                    options.data[index].dataPoints.push(dataPoints);
                    }
                }
            }
            $("#chartContainer").CanvasJSChart(options);
            })
            .catch(error => console.log(error));
        }

        // CANVAS OBJECT  //
        let options = {
            exportEnabled: true,
            animationEnabled: false,
            title: {
                text: "",
            },
            subtitles: [
                {
                    text: "Click Legend to Hide or Unhide Data Series",
                },
            ],
            axisX: {
                title: new Date(),
            },
            axisY: {
                title: "Price in USD",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: false,
            },
            toolTip: {
                shared: true,
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries,
            },
            data: [],
        };

        // CANVAS FUNCTION  //
        function toggleDataSeries(e) {
            if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }

            e.chart.render();
        }

        // scroll up to the top page when you check item at the bottom of the page

        $("#scrollButton").click( function(){
            scrollUp();

        })

        window.onscroll = function () {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollButton.style.display = "block";
            } else {
                scrollButton.style.display = "none";
            }
        }

        function scrollUp() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
        
    });
})();
