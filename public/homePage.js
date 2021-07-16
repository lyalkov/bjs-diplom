"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout((response) => {
    if (response) {
        location.reload();
    }
});

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

getRates = () => ApiConnector.getStocks((response) => {
    if (response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    }
});

getRates();
setInterval(getRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney (data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, "Пополнение баланса прошло успешно!");
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney (data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, "Конвертация валют прошла успешно!");
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney (data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, "Перевод денег прошел успешно!");
        } else {
            moneyManager.setMessage(true, response.data);
        }
    })
};

const favorites = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favorites.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favorites.setMessage(response.success, 'Пользователь добавлен');
    } else {
        favorites.setMessage(response.success, response.error);
    }
});

favorites.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favorites.setMessage(response.success, 'Пользователь добавлен');
    } else {
        favorites.setMessage(response.success, response.error);
    }
});
