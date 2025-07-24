sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sap/demo/utils/formatter",
    "sap/m/MessageToast"
], (Controller, JSONModel, formatter, MessageToast) => {
    "use strict";

    return Controller.extend("com.sap.demo.controller.Edit", {
        formatter: formatter,

        onInit() {
            
            const oData = {
                id: '',
                name: '',
                description: '',
                price: '',
                rating: ''
            }
            
            const initData = new JSONModel(oData);
            this.getView().setModel(initData, "oData");

            this.getOwnerComponent().getRouter().getRoute("Edit").
            attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function (oEvent) {
            const sID = oEvent.getParameter("arguments").ProductId;

            const sPath = "/Products(" + sID + ")";
            const oModel = this.getOwnerComponent().getModel();
           
            MessageToast.show("Fetching..", { duration: 1000,});

            oModel.read(sPath, {
                success: (oData) => {
                    
                    let sId = oData.ID;
                    let sName = oData.Name;
                    let sDescription = oData.Description;
                    let sPrice = oData.Price;
                    let sRating = oData.Rating;
                    
                    let oModel = this.getView().getModel("oData");

                    oModel.setProperty("/id", sId);
                    oModel.setProperty("/name", sName);
                    oModel.setProperty("/description", sDescription);
                    oModel.setProperty("/price", sPrice);
                    oModel.setProperty("/rating", sRating);

                },
                error: (oError) => {
                    console.error("Error al leer el cliente:", oError);
                }
            });
        },

        onEditPress: function() {
            var oView = this.getView();
            var oModel = this.getOwnerComponent().getModel();
            var oViewModel = oView.getModel("oData");
            
            MessageToast.show("Updating..", { duration: 1000,});
            
            oModel.setUseBatch(false);

            let sID = oViewModel.getProperty("/id");
            let sName = oViewModel.getProperty("/name");
            let sDescription = oViewModel.getProperty("/description");
            let sPrice = oViewModel.getProperty("/price");
            let sRating = oViewModel.getProperty("/rating");
            
            if (sName === ''){
                MessageToast.show("Name cannot be empty");
                return;
            }

            if (sPrice === ''){
                MessageToast.show("Price cannot be empty");
                return;
            }

            if (sDescription === ''){
                MessageToast.show("Description cannot be empty");
                return;
            }

            let oPayLoad = {
                Name : sName,
                Description: sDescription,
                Price : sPrice,
                Rating : sRating
            }

            oModel.update("/Products("+sID+")", oPayLoad,
            {
                success: (oData) => {
                    MessageToast.show("Success..");
                },
                error: (oError) => {
                    MessageToast.show("Error: Could not update");
                    console.error("Error de Lectura", oError);
                }
            })
        },

        onNavBack: function(){
            this.getOwnerComponent().getRouter().navTo("RouteHome", {}, true);
        },
    });
});