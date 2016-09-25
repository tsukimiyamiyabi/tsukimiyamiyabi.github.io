var ttData = [];         //當前頁面所有英靈資訊暫存陣列
var tbMax = 3;           //育成英靈數，預設為3
var itemKindMAx = 47;    //目前素材種類數
var maxImgWidth = 50;
var targetItemNo = -1;

ttDataClear(tbMax);
svtDivCreate();
myTable2();
mySelectItem();
mySerchItemCreate();


$(window).resize(function() {
  console.log($("#_itemSide").width());
});

//搜尋素材圖片建立
function mySerchItemCreate(){
    var out = "";
    for(var i = 1; i < itemKindMAx; i++ )
      out += "<img class='imgItemFloat whiteCover'  src='images/S_" + i + ".png' data-itemNo = '" + i + "'"
            + " title='" + itemData[i - 1].name + "''>";
    out += "<div style='clear:both;''></div>";
    $("#searchItemImgDiv").html(out);
}


//搜尋素材圖片點擊
$("#searchItemImgDiv").click(function(e){
    var target = $(e.target);
    if(target.attr("id")!= "searchItemImgDiv"){
      if(target.hasClass("whiteCover")){
          if(targetItemNo != -1){
              $("#searchItemImgDiv img").eq(targetItemNo - 1).addClass("whiteCover");
          }
          targetItemNo = target.attr("data-itemNo");
          target.removeClass("whiteCover");
          console.log(targetItemNo);
          itemDivCreate(targetItemNo - 1);
      }else{
          targetItemNo = -1;
          console.log(targetItemNo);
          target.addClass("whiteCover");
          $("#_itemSide").html("");
      }
    }
});


//搜尋素材編號選單產生
function mySelectItem(){
    var i = 0;
    var out = "<select id=";
    out += "searchItemSlect" +
    " style=\"width: 250px; font-size: 12px;\"" +
    " onChange = \"itemSlectNoChange()\">" + "<br>" +
    "<option value =\"-1\">請選擇</option>";

    for(i = 0; i < itemKindMAx; i++){
        out +=   "<option value =\"" +
        i +
        "\">" +
        itemData[i].name +
        "</option>" + "<br>";
    }
    out += "</select>";
    $("#searchItemDiv").html(out);
}

//素材搜尋區塊初始化
function itemDivCreate(itemNo){
    var countSvt = 100;
    var maxSLV = 0;
    var minSLV = 0;
    var targetSvtNo = -1;
    $("#_itemSide").html("");

    //console.log(itemNo);
    for(var i = 0; i < svtData.length ; i++){
        if(i == 82) continue;
        maxSLV = 0;
        minSLV = 0;
        targetSvtNo = -1;
        for(var j = 0; j < 9; j++){
            for(var k = 0; k < svtData[i].skillLevel[j].skillItem.length; k++){
              if(svtData[i].skillLevel[j].skillItem[k].image == (parseInt(itemNo) + 1)){
                //console.log(svtData[i].skillLevel[j].skillItem[k].image );
                if(minSLV == 0){
                  minSLV = j + 1;
                  maxSLV = j + 2;
              //    console.log("min: min:"+minSLV+" ,"+"max:"+maxSLV);
                  targetSvtNo = i;
                  countSvt++;
                }else {
                  if(j+1 >= maxSLV){
                    maxSLV = j + 2;
                //    console.log(j);
              //      console.log("max: min:"+minSLV+" ,"+"max:"+maxSLV);
                  }
                }
              }
            }
        }

        if(targetSvtNo!=-1){
            var newItemSvtDiv = $(itemSvt_templet).clone();
            newItemSvtDiv.attr("id","itemSvt_" + countSvt);
            newItemSvtDiv.find("div").attr("id","dataTalbe" + countSvt);
            newItemSvtDiv.find("img").attr("id","img_itemSvtNo_" + (countSvt-100));
            newItemSvtDiv.removeClass("displayNone");
            $("#_itemSide").append(newItemSvtDiv);
            myTable(countSvt, targetSvtNo , minSLV, maxSLV, 1);
            $("#img_itemSvtNo_" + (countSvt-100)).attr("src","./images/svtNo_" + (targetSvtNo+1)  + ".png");
            $("#img_itemSvtNo_" + (countSvt-100)).attr("title", "No." + (targetSvtNo+1) + " " + svtData[targetSvtNo].svtName);
            $("#img_itemSvtNo_" + (countSvt-100)).removeClass("displayNone");
            $("#img_itemSvtNo_" + (countSvt-100)).attr("style","margin-left: 20px");
        }
    }
}

//英靈最大數量改變
function itemSlectNoChange() {
    itemSlectNo = $("#searchItemSlect").val();
    itemDivCreate(itemSlectNo);
}


//右邊table可拖曳化
$(function() {
  $( "#tottleTable" ).draggable({ cursor: "move" });
  $( "#tabs" ).tabs({ collapsible: true });
//  $( "input" ).checkboxradio({ icon: false  });
});


//清除按鈕
$("#clear").click(function(e){
    ttDataClear(tbMax);
    svtDivCreate();
    myTable2();
});

//隱藏按鈕
$("#_leftSide").click(function(e){
    var target = $(e.target);
    var mdiv =  target.closest("div");
    if(mdiv.find("[type=checkbox]")[0].checked==true){
        mdiv.find("div").addClass("displayNone");
        mdiv.find("img:eq(0)").removeClass("imgFloat");
        mdiv.find("img:eq(0)").addClass("imgWhenHide");
    }else{
        mdiv.find("div").removeClass("displayNone");
        mdiv.find("img:eq(0)").addClass("imgFloat");
        mdiv.find("img:eq(0)").removeClass("imgWhenHide");
    }
});

//英靈最大數量改變
function tbMaxChange() {
    tbMax = $("#maxSvtNum").val();
    ttDataClear(tbMax);
    svtDivCreate();
    myTable2();
}

//左邊區塊初始化
function svtDivCreate(){
    $("#_leftSide").html("");
    for(var i = 1; i <= tbMax ; i++){
        var newSvtDiv = $(svt_templet).clone();
        newSvtDiv.attr("id","svt_" + i);
        newSvtDiv.find("span").eq(0).attr("id","svt_" + i + "_span_1");
        newSvtDiv.find("span").eq(2).attr("id","svt_" + i + "_span_2");
        newSvtDiv.find("span").eq(4).attr("id","svt_" + i + "_span_3");
        newSvtDiv.find("div").attr("id","dataTalbe" + i);
        newSvtDiv.find("img").attr("id","img_svtNo_" + i);
        newSvtDiv.removeClass("displayNone");
        $("#_leftSide").append(newSvtDiv);

        mySelectSvt("svt_" + i + "_span_1","selcetNo" + i,svtData.length);
        mySelectSlvMin("svt_" + i + "_span_2","selcetMin_" + i, 9, "selectchgMin(" + i + ")");
        mySelectSlvMax("svt_" + i + "_span_3","selcetMax_" + i, 10, "selectchg");
        myTable(i,$("#selcetNo" + i).val(),parseInt($("#selcetMin_" + i).val()),parseInt($("#selcetMax_" + i).val()),0);
    }
}

//素材總計陣列初始化
function ttDataClear(tableMax) {
    for(var j = 0; j < tableMax + 1; j++){
        ttData[j] = [];
        for(var i = 0; i < itemKindMAx + 1; i++){
            ttData[j][i] = 0;
        }
    }
}

//素材總計陣列重新計算
function countItemAll(tableMax) {
    for(var i = 0; i < itemKindMAx + 1; i++){
        for(var j = 1; j < tableMax + 1; j++){
            if(ttData[j][i]!=0)
              ttData[0][i]+=ttData[j][i];
        }
    }
}

//英靈編號選單產生
function mySelectSvt(spanId,selectName,number){
    var i = 0;
    var out = "<select id=";
    out += selectName +
    " style=\"width: 250px; font-size: 12px;\"" +
    " onChange = \"selectchg()\">" + "<br>" +
    "<option value =\"-1\">請選擇</option>";

    for(i = 0; i < number; i++){
        if(i==82)
            continue;
        out +=   "<option value =\"" +
        i +
        "\">" +
        "No." +
        (i + 1) + " " +
        svtData[i].svtName +
        "</option>" + "<br>";
    }
    out += "</select>";
    $("#"+spanId).html(out);
    //document.getElementById(spanId).innerHTML = out;
}

//最小技能等級選單產生
function mySelectSlvMin(spanId,selectName,number,selchgName){
    var i = 0;
    var out = "<select id=";
    out += selectName +
    " onChange = \"" + selchgName +"\">" + "<br>" +
    "<option value =\"-1\">請選擇</option>";

    for(i = 0; i < number; i++){
        out +=   "<option value =\"" +
        (i + 1) +
        "\">" +
        (i + 1) + " " +
        "</option>" + "<br>";
    }
    out += "</select>";
    $("#"+spanId).html(out);
  //  document.getElementById(spanId).innerHTML = out;
}

//最大技能等級選單產生
function mySelectSlvMax(spanId,selectName,slvMin,selchgName){
    var i = 0;
    var out = "<select id=";
    out += selectName +
    " onChange = \"" + selchgName +"()\">" + "<br>" +
    "<option value =\"10\">請選擇</option>";

    for(i = slvMin; i < 10; i++){
        out +=   "<option value =\"" +
        (i + 1) +
        "\">" +
        (i + 1) + " " +
        "</option>" + "<br>";
    }
    out += "</select>";
    $("#"+spanId).html(out);
    //document.getElementById(spanId).innerHTML = out;
}

//當英靈編號選單 or 最大技能等級選單變動
function selectchg(){
    ttDataClear(tbMax);
    for(var i = 1; i <= tbMax ; i++){
        myTable(i,$("#selcetNo" + i).val(),parseInt($("#selcetMin_" + i).val()),parseInt($("#selcetMax_" + i).val()),0);
        $("#img_svtNo_"+i).attr("src","./images/"+"svtNo_" + $("#selcetNo" + i).val() + ".png");

        if($("#selcetNo" + i).val()!=-1){
            $("#img_svtNo_" + i).attr("src","./images/svtNo_" + (parseInt($("#selcetNo" + i).val()) + 1) + ".png");
            $("#img_svtNo_" + i).attr("title", svtData[parseInt($("#selcetNo" + i).val())].svtName);
            $("#img_svtNo_" + i).removeClass("displayNone");
        }else{
            $("#img_svtNo_" + i).attr("src","");
            $("#img_svtNo_" + i).addClass("displayNone");

        }
    }

    countItemAll(tbMax);
    myTable2();

}

//當最小技能等級選單變動
function selectchgMin(svtNo){
    var wk_selectNo = "#selcetNo" + svtNo;
    var wk_selectMin = "#selcetMin_" + svtNo;
    var wk_selectMax = "#selcetMax_" + svtNo;
    var wk_svtNo_span = "svt_" + svtNo + "_span_3";
    myTable(svtNo,$(wk_selectNo).val(),parseInt($(wk_selectMin).val()),parseInt($(wk_selectMax).val()),0);
    mySelectSlvMax(wk_svtNo_span,"selcetMax_" + svtNo,parseInt($(wk_selectMin).val()),"selectchg");
    ttDataClear(tbMax);
    myTable2();
}

//英靈素材資訊表格產生
function myTable(tableNum, svtNo, min, max, type) {
    var i = 0, j = 0, t = 0;
    var qpTemp = 0;
    var itemMax = 0;
    var tableName = "dataTalbe" + tableNum.toString();
    var out = "<table";
    var flag = 1;

    if(type)
      out += " class='mtable'>";
    else {
      out += ">";
    }

    //---如果最小等級沒選擇，則預設為1級
    if(min == -1){
        min = 1;
    }
    //---

    if(svtNo != -1){
        for(i = min - 1; i < max - 1; i++){
            if(svtData[svtNo].skillLevel[i].skillItem.length > itemMax)
                itemMax = svtData[svtNo].skillLevel[i].skillItem.length;
        }
    }

    out += "<tr>";
    for(i = min - 1; i < max - 1; i++){
        //素材搜尋 且 素材數量大於3時，合併儲存格
        if(type == 1 && itemMax >= 3)
            out += "<td colspan='2'>";
        else
            out += "<td>";
        out += "Slv " +
        (i + 1).toString() +
        " → " +
        (i + 2).toString() +
        "</td>";
    }
    out += "</tr>";


    //---如果沒選擇英靈則不產生
    if(svtNo != -1){
        for(i = min - 1; i < max - 1; i++){
            qpTemp = 0;
            for(t = 0; t < svtData[svtNo].skillLevel[i].QP[0].value.length; t++){
                if(svtData[svtNo].skillLevel[i].QP[0].value[t]!=",")
                    qpTemp = qpTemp*10 + parseInt(svtData[svtNo].skillLevel[i].QP[0].value[t]);
            }
            if(tableNum < 100)
              ttData[tableNum][0]+=qpTemp;

              //素材搜尋 且 素材數量大於3時，合併儲存格
              if(type == 1 && itemMax >= 3)
                  out += "<td colspan='2'>";
              else
                  out += "<td>";
            out += "<img style='width:" + maxImgWidth +"px' src =\"./images/S_" +
            svtData[svtNo].skillLevel[i].QP[0].image +
            ".png\" title='QP'> <br> x " ;
            out += thousandComma(qpTemp/1000) + " k";
            out += "</td>";

        }
        out += "</tr>";

        for( j = 0; j < itemMax; j++) {
            flag = 1;
            if(type == 1 && itemMax >= 3 && (j == 1 || j == 3))
              flag = 1;
            else
              out += "<tr>";

            if(type == 1 && itemMax >= 3 && (j == 0 || j == 2))   //素材搜尋 且 素材數量大於3時，寫入左邊格子
                flag = 0;

            for(i = min - 1; i < max - 1; i++){
                out += "<td>";
                if(svtData[svtNo].skillLevel[i].skillItem.length > j){
                    out += "<img style='width:" + maxImgWidth +"px' src =\"./images/S_" +
                    svtData[svtNo].skillLevel[i].skillItem[j].image +
                    ".png\" title='" +
                    svtData[svtNo].skillLevel[i].skillItem[j].name +
                    "'> <br> x " +
                    svtData[svtNo].skillLevel[i].skillItem[j].number;

                    if(tableNum < 100)
                      ttData[tableNum][svtData[svtNo].skillLevel[i].skillItem[j].image]+=svtData[svtNo].skillLevel[i].skillItem[j].number;
                }
                out += "</td>";
            }

            if(flag)
              out += "</tr>";
        }
    }
    out += "</table>";
    $("#"+tableName).html(out);
    //document.getElementById(tableName).innerHTML = out;
}

//右邊總計表格產生
function myTable2() {
    var i = 0, j = 0;
    var itemCount = 0;
    var qpString = 0;
    var out = "<table>";

    qpString = thousandComma(ttData[0][0]);

    out += "<tr>";
    out += "<td colspan=\"3\">";
    out += "<img style='width:" + maxImgWidth +"px' src =\"./images/S_QP.png\"> <br> x " ;
    out += qpString;
    out += "</td></tr>";
    out += "<br>";

    //console.log(ttData[0][0]);

    for(i = 1; i < itemKindMAx + 1; i++){

        if (ttData[0][i] < 1){
            continue;
        };

        itemCount++;

        if(itemCount % 3 == 1){
            out+="<tr>";
        }
        out += "<td>"
        out += "<img style='width:" + maxImgWidth +"px' src =\"./images/S_";
        out += i;
        out += ".png\"> <br> x " ;
        out += ttData[0][i];
        out += "</td>";

        if(itemCount % 3 == 0){
            out+="</tr>";
        }
    }

    out += "</table>";

    $("#tottleTable").html(out);
    //document.getElementById("tottleTable").innerHTML = out;
}

//千分位表示
function thousandComma(number) {
    var num = number.toString();
    var pattern = /(-?\d+)(\d{3})/;

    while(pattern.test(num)) {
        num = num.replace(pattern, "$1,$2");
    }
    return num;

}
