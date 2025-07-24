sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sap/demo/utils/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast"
], (Controller, JSONModel, formatter, Filter, FilterOperator, Sorter, MessageToast) => {
    "use strict";

    return Controller.extend("com.sap.demo.controller.Home", {
        formatter: formatter,

        onInit() {
            this._bSortAscending = false; // inicia orden ascendente

            let oData = {
                select: 'ID',
                searchtxt: 'ID',
                searchValue: ''
            }

            let oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "oData");
        },

        onSelect(oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem");
            let sText = oSelectedItem.getText();

            // Actualizar la propiedad 'select' con el texto seleccionado
            let oModel = this.getView().getModel("oData");
            oModel.setProperty("/select", sText);
            oModel.setProperty("/searchtxt", sText);
        },

        onSearch: function () {
            const aFilter = [];

            let sQuery = this.getView().byId("searchfield").getValue();
            let sDropBox = this.getDropBoxValue();

            if (sQuery) {
                if (sDropBox === 'ID') {
                    aFilter.push(new Filter(sDropBox, FilterOperator.EQ, sQuery));
                } else {
                    aFilter.push(new Filter(sDropBox, FilterOperator.Contains, sQuery));
                }
            }

            // filter binding
            const oList = this.byId("IDList1");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },

        getDropBoxValue: function () {
            let sString = this.getView().getModel("oData").getProperty("/select");

            return sString;
        },

        onSort: function () {
            const sSortField = "ID";

            const oSorter = new Sorter(sSortField, !this._bSortAscending);

            const oList = this.byId("IDList1");
            const oBinding = oList.getBinding("items");

            oBinding.sort(oSorter);

            this._bSortAscending = !this._bSortAscending;
            MessageToast.show("Sorting..", {
                duration: 1000,
            });
        },

        onNewProduct: function(){
            this.getOwnerComponent().getRouter().navTo("Products");
        }
    });
});