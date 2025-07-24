sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sap/demo/utils/formatter",
    "sap/m/MessageToast"
], (Controller, JSONModel, formatter, MessageToast) => {
    "use strict";

    return Controller.extend("com.sap.demo.controller.Products", {
        formatter: formatter,

        onInit() {

            const oData = {
                ID: '',
                Name: '',
                Description: '',
                Rating: '',
                Price: '',
            }

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "oModel");
        },

        onSavePress: function () {
            this.sLastID = 0;

            const oModel = this.getView().getModel("oModel");

            const oPayLoad = {
                ID: 0,
                Name: oModel.getProperty("/Name"),
                Description: oModel.getProperty("/Description"),
                Price: oModel.getProperty("/Price"),
                Rating: oModel.getProperty("/Rating")
            }

            let sError = this._validateFields(oPayLoad);

            if (sError) {
                MessageToast.show(sError);
                return;
            }

            var oDataModel = this.getOwnerComponent().getModel();

            oDataModel.read("/Products", {
                success: (oData) => {
                    const aProducts = oData.results;

                    if (aProducts.length === 0) {
                        MessageToast.show("No hay productos");
                        return;
                    }

                    // Ordenar 
                    aProducts.sort((a, b) => Number(a.ID) - Number(b.ID));

                    this.sLastID = aProducts[aProducts.length - 1].ID;
                    this.sLastID = this.sLastID + 1;
                    oPayLoad.ID = this.sLastID;
                    this.onSave(oPayLoad);
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
        },

        onSave: function (oPayLoad) {

            let oDataModel = this.getOwnerComponent().getModel();
            oDataModel.setUseBatch(false);

            oDataModel.create("/Products", oPayLoad, {
                success: (oData) => {
                    console.log(oData);
                    MessageToast.show("DB Updated");
                    this._clearFields();
                },
                error: (oError) => {
                    MessageToast.show("Error");
                    console.error("Error al leer el cliente:", oError);
                }
            });
        },

        _clearFields: function () {
            let oModel = this.getView().getModel("oModel");

            oModel.setProperty("/ID", '');
            oModel.setProperty("/Name", '');
            oModel.setProperty("/Description", '');
            oModel.setProperty("/Price", '');
            oModel.setProperty("/Rating", '');
        },

        _validateFields: function (oData) {
            if (!oData.Name) return "Name field missing";
            if (!oData.Description) return "Description field missing";
            if (!oData.Rating) return "Rating cannot be 0";
            if (!oData.Price || oData.Price == 0) return "Price field missing";
            return null;
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteHome", {}, true);
        },

    });
});