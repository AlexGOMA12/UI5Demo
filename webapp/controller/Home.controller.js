sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/sap/demo/utils/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet"
], (Controller, JSONModel, formatter, Filter, FilterOperator, Sorter, MessageToast, Spreadsheet) => {
    "use strict";

    return Controller.extend("com.sap.demo.controller.Home", {
        formatter: formatter,

        onInit() {
            this.getData(); //Get Main Model

            this._bSortAscending = false; // inicia orden ascendente

            let oData = {
                select: 'ID',
                searchtxt: 'ID',
                searchValue: ''
            }

            let oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "oData");

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteHome").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this.getData();
        },

        getData: function () {
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();

            oDataModel.read("/Products", {
                success: function (oData) {
                    var jModel = new JSONModel(oData);
                    that.getView().byId("List").setModel(jModel);
                },
                error: function (oError) {
                    console.log(oError);
                }
            });
        },

        onSelect: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem");
            let sText = oSelectedItem.getText();

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

            const oList = this.byId("List");
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

            const oList = this.byId("List");
            const oBinding = oList.getBinding("items");

            oBinding.sort(oSorter);

            this._bSortAscending = !this._bSortAscending;

            MessageToast.show("Sorting..", {
                duration: 1000,
            });
        },

        onNewProduct: function () {
            this.getOwnerComponent().getRouter().navTo("Products");
        },

        onEdit: function (oEvent) {

            const oItem = oEvent.getSource();
            const sProductID = oItem.getBindingContext().getProperty("ID");

            this.getOwnerComponent().getRouter().navTo("Edit", {
                ProductId: sProductID
            });
        },

        onDelete: function (oEvent) {
            const oItem = oEvent.getSource();
            const oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);

            const sID = parseInt(oItem.getBindingContext().getProperty("ID"), 10);
            console.log(sID);

            oModel.remove("/Products(" + sID + ")",
                {
                    success: (oData) => {
                        console.log(oData);
                        MessageToast.show("Deleted..");
                        this.getData();
                    },
                    error: (oError) => {
                        MessageToast.show("Error: Could not delete");
                        console.error("Error de Lectura", oError);
                    }
                })
        },

        onFetch: function () {
            MessageToast.show("Fetching..", {
                duration: 1000,
            });

            this.getData(); //Get Main Model
        },

        onExcel: function () {
            var aSelectedData = [];
            var oTable = this.byId("List");
            var aSelectedItem = oTable.getSelectedItems();

            aSelectedItem.forEach(function (dataItem) {
                var dataContext = dataItem.getBindingContext();

                if (dataContext) {
                    aSelectedData.push(dataContext.getObject());
                }
            })

            this._generateExcel(aSelectedData);

        },

        _generateExcel: function (aSelectedData) {

            var aColumns = [
                { label: "Product ID", property: "ID" },
                { label: "Name", property: "Name" },
                { label: "Description", property: "Description" },
                { label: "Rating", property: "Rating" },
                { label: "Price", property: "Price" },
            ];

            var oSetting = {
                workbook:{ columns: aColumns}, 
                dataSource: aSelectedData, 
                fileName: "TestExcel.xlsx"
            };

            var oSpreadSheet = new Spreadsheet(oSetting);
            oSpreadSheet.build();

        }
    });
});