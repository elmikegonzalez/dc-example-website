(function() {

    //TODO: This should not be hard coded
    const API_URL = '//willow-demo-leankit.dev.adis.ws';
    const BOARD_ID = '680372499';

    function LeankitCard(card) {

        this.getStatus = function(contentId) {
            return fetch(API_URL + `/lk/${BOARD_ID}/card/${contentId}`)
                .then(r => r.json())
                .then(response => {
                    if(response.cards && response.cards.length > 0) {
                        return response.cards[0];
                    }else{
                        return null;
                    }
                });
        }

        this.displayStatus = function(contentId) {
            const statusView = card.querySelector('.leankit-card-status');

            this.getStatus(contentId)
                .then(function(cardMetaData) {
                    let status = 'not-found';
                    let statusText = 'No Kanban Card';

                    if(cardMetaData) {
                        if(cardMetaData.actualStart) {
                            status = 'in-progress';
                            statusText = 'In Progress';
                        }else{
                            status = 'backlog';
                            statusText = 'In Backlog';
                        }
                        if(cardMetaData.actualFinish) {
                            status = 'complete';
                            statusText = 'Completed';
                        }
                        if(cardMetaData.blockedStatus && cardMetaData.blockedStatus.isBlocked) {
                            status = 'blocked';
                            statusText = 'Blocked';
                        }
                    }
                    statusView.classList.add('leankit-card-status-' + status);
                    statusView.innerText = statusText;
                });
        }
    }

    this.displayStatus = function(contentId, view) {
        const card = new LeankitCard(document.querySelector(view));
        card.displayStatus(contentId);
    }

}).apply(window.leankitCard = window.leankitCard || {});