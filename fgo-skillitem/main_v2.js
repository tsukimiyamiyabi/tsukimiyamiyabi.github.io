var ttData = [];         //當前頁面所有英靈第1組資訊暫存陣列
var tbMax = 3;           //育成英靈數，預設為3
var Max_tbMax = 20; 	 //育成英靈數最大數10
var itemKindMAx = 69;    //目前素材種類數
var classMax = 13;		 //目前職階種類數
var maxImgWidth = 50;
var targetItemNo = -1;
var isChinese = 0;
var ClassData = ["全","剣","槍","弓","騎","術","殺","狂","盾","裁","讐","分","月","降"];

ttDataClear(-1);
svtDivCreate();
myTable2();
mySelectItem();
mySerchItemCreate();
mySerchClassCreate();


/*$(window).resize(function() {
  console.log($("#_itemSide").width());
});*/


//搜尋職階過濾圖片建立
function mySerchClassCreate(){
	var out = "";
    for(var i = 0; i <= classMax; i++ )
      out += "<img class='imgItemFloat' id='class_filter_" + i + "' " + "src='images/class_" + i + ".png' data-ClassNo = '" + i + "'"
			+ " title='" + ClassData[i] + "''>";
    out += "<div style='clear:both;''></div>";
    $("#searchClassImgDiv").html(out);
}

//搜尋職階過濾圖片點擊
$("#searchClassImgDiv").click(function(e){
    var target = $(e.target);
    if(target.attr("id")!= "searchClassImgDiv"){
		if(target.attr("data-ClassNo")!= 0){
			if(target.hasClass("whiteCover")){
				target.removeClass("whiteCover");
				itemDivCreate(targetItemNo - 1);
			}else{
				target.addClass("whiteCover");
				itemDivCreate(targetItemNo - 1);
			}
		}else{
			if(target.hasClass("whiteCover")){				
				for(var i = 0; i <= classMax; i++)
					$("#searchClassImgDiv img").eq(i).removeClass("whiteCover");
				itemDivCreate(targetItemNo - 1);
			}else{
				for(var i = 0; i <= classMax; i++)
					$("#searchClassImgDiv img").eq(i).addClass("whiteCover");
				itemDivCreate(targetItemNo - 1);
			}
		}
    }
});


//搜尋素材圖片建立
function mySerchItemCreate(){
    var out = "";
    for(var i = 1; i <= itemKindMAx; i++ )
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
          itemDivCreate(targetItemNo - 1);
      }else{
          targetItemNo = -1;
          target.addClass("whiteCover");
          $("#_itemSide").html("");
      }
    }
});

function itemClick(e) {
    var id = +$(e.target).data("itemno"),
        item = $("#searchItemImgDiv img").eq(id - 1);

    if (!item.length) return;

    targetItemNo = id;
    $("#searchItemImgDiv img").addClass("whiteCover");
    item.removeClass("whiteCover");
    itemDivCreate(id - 1);
    $("#tabs").tabs({active: 1});
}

function servantClick(e) {
    var id = +$(e.target).data("svtno"),
        emptySlot = $("#_leftSide .select-svt-id").filter(function(){
            return $(this).val() == null || +$(this).val() < 0;
        }).first();

    if (!emptySlot.length) {
        var l = $("#_leftSide").children().length;
        if (l >= 10) {
            return;
        }
        $("#maxSvtNum").val(l + 1);
        tbMaxChange();
        emptySlot = $("#_leftSide .select-svt-id").last();
    }

    var pid = +emptySlot.closest(".svt-panel").data("number");
    emptySlot.val(id - 1);
    selectchg(pid);
    $("#tabs").tabs({active: 0});
}

//搜尋素材編號選單產生
function mySelectItem(){
    var i = 0;
    var out = "<option value =\"-1\">請選擇</option>";

    for(i = 0; i < itemKindMAx; i++){
        out +=   "<option value =\"" +
        i +
        "\">" +
        itemData[i].name +
        "</option>";
    }
    $("#searchItemSlect").html(out);
}

//素材搜尋區塊初始化
function itemDivCreate(itemNo){
    var countSvt = 100;
    var maxSLV = 0;
    var minSLV = 0;
    var targetSvtNo = -1;
	var filterSkip = 0;
    $("#_itemSide").html("");

    var searchSkill = $("#searchSkill").prop("checked"),
        searchAscension = $("#searchAscension").prop("checked");

    if (!searchSkill && !searchAscension) return;

    //console.log(itemNo);
    for(var i = 0; i < svtData.length ; i++){
		filterSkip = 0;
        if(i == 82 || i == 148 || i == 150 || i == 151 || i == 167 || i == 239 ) continue;  //跳過缺號的英靈
		if(ascension["" + ( i + 1 ) + ""] != undefined){
			for(var n = 1; n <= classMax; n++){
				if($("#class_filter_" + n).hasClass("whiteCover")){
					if(ascension["" + ( i + 1 ) + ""].cls == ClassData[n]) {
						filterSkip = 1;
						break;
					}
				}
			}
		}
		if(filterSkip) continue;
		
        maxSLV = 0;
        minSLV = 0;
        targetSvtNo = -1;
        if (searchSkill) {
            for(var j = 0; j < 9; j++){
                for(var k = 0; k < svtData[i].skillLevel[j].skillItem.length; k++){
                  if(svtData[i].skillLevel[j].skillItem[k].image == (parseInt(itemNo) + 1)){
                    if(minSLV == 0){
                      minSLV = j + 1;
                      maxSLV = j + 2;
                      targetSvtNo = i;
                      countSvt++;
                    }else {
                      if(j+1 >= maxSLV){
                        maxSLV = j + 2;
                      }
                    }
                  }
                }
            }
        }
        var ascs = [];
        if (searchAscension && ascension[i + 1]) {
            for (j = 0; j < ascension[i + 1].ascension.length; j++) {
                var asc = ascension[i + 1].ascension[j];
                for (var key in asc) {
                    if (itemImage[key] == +itemNo + 1) {
                        ascs.push([j, asc]);
                        break;
                    }
                }
            }
        }
        if (targetSvtNo < 0 && ascs.length) {
            targetSvtNo = i;
            countSvt++;
        }
        if(targetSvtNo!=-1){
            var newItemSvtDiv = $("#itemSvt_templet").clone();
            newItemSvtDiv.attr("id","itemSvt_" + countSvt);
            newItemSvtDiv.find(".skill-table").attr("id","dataTalbe" + countSvt);
            newItemSvtDiv.find("img").attr("id","img_itemSvtNo_" + (countSvt-100));
            newItemSvtDiv.removeClass("displayNone");
            $("#_itemSide").append(newItemSvtDiv);
            myTable(countSvt, targetSvtNo , minSLV, maxSLV, 1);
            $("#img_itemSvtNo_" + (countSvt-100)).attr("src","./images/svtNo_" + (targetSvtNo+1)  + ".png");
            $("#img_itemSvtNo_" + (countSvt-100)).attr("title", "No." + (targetSvtNo+1) + " " + svtData[targetSvtNo].svtName);
            $("#img_itemSvtNo_" + (countSvt-100)).removeClass("displayNone");
            $("#img_itemSvtNo_" + (countSvt-100)).data("svtno", targetSvtNo + 1);
            $("#img_itemSvtNo_" + (countSvt-100)).on("click", servantClick);
            newItemSvtDiv.find(".ascension-table tbody").html(buildAscensionTable(ascs));
        }
    }
}

//搜尋素材選單改變
function itemSlectNoChange() {
    var itemSlectNo = $("#searchItemSlect").val();
    itemDivCreate(itemSlectNo);
}


//右邊table可拖曳化
$(function() {
  $( "#tottleTable" ).draggable({ cursor: "move" });
  $( "#tottleImageDiv" ).draggable({ cursor: "move" });
  $( "#tabs" ).tabs({ collapsible: true });
//  $( "input" ).checkboxradio({ icon: false  });
});

function resetAllTable() {	
    ttDataClear(0);
    svtDivCreate(true);
    myTable2();
}

//清除按鈕
$("#clear").click(resetAllTable);

//總和截圖
$("#screenShot").click(function() {
	html2canvas($("#tottleTable"), {
        onrendered: function(canvas) {
            // canvas is the final rendered <canvas> element
            var myImage = canvas.toDataURL();
			console.log(myImage);
			var out = "<img id ='btnClose' style='float:right' src='./images/btn_close.png' >";
			$("#tottleImageDiv").html(out);
			$("<img />", { src: myImage }).appendTo($("#tottleImageDiv"));
			$("#tottleImageDiv").removeClass("displayNone");
            //window.open(myImage);
        }
    });
});

$("#tottleImageDiv").click(function(e){
	var target = $(e.target);
    var mdiv =  target.closest("div");
    if(target.attr("id") == "btnClose"){
        mdiv.addClass("displayNone");
	}
    
});

//總數量table隱藏 & 中文化
$("#top_div").click(function(e){
    var target = $(e.target);
    var mdiv =  target.closest("div");
    if(mdiv.find("[type=checkbox]")[1].checked == true){
        $("#tottleTable").addClass("displayNone");
    }else {
        $("#tottleTable").removeClass("displayNone");
    }

    if(target.attr("id") == "chkChinese"){
        if(mdiv.find("[type=checkbox]")[0].checked == true){
            isChinese = 1;
        }else {
            isChinese = 0;
        }
        resetAllTable();
    }	
});

//隱藏素材表，並縮小化英靈圖
$("#_leftSide").click(function(e){
    var target = $(e.target);
    var mdiv =  target.closest("div");
    var target_i;
    var skillNow;
    var isSkillNoChg = 0;

    //技能組數字圖示切換
    for(var i = 1; i <= tbMax; i++){
        skillNow = $("#svt_" + i).attr("data-skillNow");
        for(var j = 1; j <= 3; j++){
            if(target.attr("id") == ("img_skillNo" + i + "_" + j)){
                if(skillNow != j){
                    $("#img_skillNo" + i + "_" + skillNow).addClass("whiteCover");
                    target.removeClass("whiteCover");
                    $("#svt_" + i).attr("data-skillNow", j) ;
                    //將目前最小技能跟最大技能存入IMG TAG
                    $("#img_skillNo" + i + "_" + skillNow).attr("data-min", $("#selcetMin_" + i ).val()) ;
                    $("#img_skillNo" + i + "_" + skillNow).attr("data-max", $("#selcetMax_" + i ).val()) ;
                    target_i = i;
                    isSkillNoChg = 1;
                    skillNow = j;
                    break;
                }
            }
        }
        if(isSkillNoChg)
          break;
    }

    if(isSkillNoChg){ //No是Number 不是NO
        //console.log(target_i + "," + $("#img_skillNo" + target_i + "_" + skillNow).attr("data-min") + "," + $("#img_skillNo" + target_i + "_" + skillNow).attr("data-max"));
        myTable(target_i,$("#selcetNo" + target_i).val(),$("#img_skillNo" + target_i + "_" + skillNow).attr("data-min"),$("#img_skillNo" + target_i + "_" + skillNow).attr("data-max"),0,1);
        mySelectSlvMin("svt_" + target_i + "_span_2","selcetMin_" + target_i, 9, "selectchgMin(" + target_i + ")");
        mySelectSlvMax("svt_" + target_i + "_span_3","selcetMax_" + target_i, parseInt($("#img_skillNo" + target_i + "_" + skillNow).attr("data-min")), "selectchg");
        $("#selcetMin_" + target_i).val($("#img_skillNo" + target_i + "_" + skillNow).attr("data-min"));
        $("#selcetMax_" + target_i).val($("#img_skillNo" + target_i + "_" + skillNow).attr("data-max"));
        //如果最大技能設為"0"，則將英靈圖片設為整行
        if($("#selcetMax_" + target_i).val() == 0){
            $("#img_svtNo_" + target_i).addClass("nonFloat");
        }else{
            $("#img_svtNo_" + target_i).removeClass("nonFloat");
        }
    }

    //隱藏
    if(mdiv.find("[type=checkbox]")[0].checked==true){
        mdiv.find("div").addClass("displayNone");
        mdiv.find("img:eq(3)").removeClass("imgFloat");
        mdiv.find("img:eq(3)").addClass("imgWhenHide");
    }else {
        mdiv.find("div").removeClass("displayNone");
        mdiv.find("img:eq(3)").addClass("imgFloat");
        mdiv.find("img:eq(3)").removeClass("imgWhenHide");
    }


});

//英靈最大數量改變
function tbMaxChange() {
    tbMax = $("#maxSvtNum").val();
    //ttDataClear(0);
    svtDivCreate();
    selectchg(0);
	
}

//左邊區塊初始化
function svtDivCreate(clear){
    var currentCount;

    if (clear) {
        $("#_leftSide").empty();
        currentCount = 0;
    } else {
        currentCount = $("#_leftSide").children().length;
        if (currentCount > tbMax) {
            $("#_leftSide").children().slice(tbMax).remove();
        }
    }

    for(var i = currentCount + 1; i <= tbMax ; i++){
        var newSvtDiv = $("#svt_templet").clone();
        newSvtDiv.attr("id","svt_" + i);
        newSvtDiv.attr("data-number", i);
        newSvtDiv.find("span").eq(0).attr("id","svt_" + i + "_spanClass");
        newSvtDiv.find("span").eq(1).attr("id","svt_" + i + "_span_1");
        newSvtDiv.find("span").eq(3).attr("id","svt_" + i + "_span_2");
        newSvtDiv.find("span").eq(5).attr("id","svt_" + i + "_span_3");
        newSvtDiv.find(".skill-table").attr("id","dataTalbe" + i);
        newSvtDiv.find("img").eq(0).attr("id","img_skillNo" + i + "_1");
        newSvtDiv.find("img").eq(1).attr("id","img_skillNo" + i + "_2");
        newSvtDiv.find("img").eq(2).attr("id","img_skillNo" + i + "_3");
        newSvtDiv.find("img").eq(3).attr("id","img_svtNo_" + i);
        newSvtDiv.removeClass("displayNone");
        $("#_leftSide").append(newSvtDiv);

        $("#img_skillNo" + i + "_1").attr("title",1);
        $("#img_skillNo" + i + "_2").attr("title",2);
        $("#img_skillNo" + i + "_3").attr("title",3);
        $("#img_skillNo" + i + "_1").attr("src","images/btn_dig_1.png");
        $("#img_skillNo" + i + "_1").removeClass("displayNone");
        $("#img_skillNo" + i + "_2").attr("src","images/btn_dig_2.png");
        $("#img_skillNo" + i + "_2").removeClass("displayNone");
        $("#img_skillNo" + i + "_3").attr("src","images/btn_dig_3.png");
        $("#img_skillNo" + i + "_3").removeClass("displayNone");
        mySelectSvtClass(i,"svt_" + i + "_spanClass","selcetClassNo" + i);
        mySelectSvt(i,"svt_" + i + "_span_1","selcetNo" + i,svtData.length);
        mySelectSlvMin("svt_" + i + "_span_2","selcetMin_" + i, -1, "selectchgMin(" + i + ")");
        mySelectSlvMax("svt_" + i + "_span_3","selcetMax_" + i, 10, "selectchg");
        myTable(i,$("#selcetNo" + i).val(),parseInt($("#selcetMin_" + i).val()),parseInt($("#selcetMax_" + i).val()),0,0);
        updateAscensionTable(newSvtDiv);
    }
}

//素材總計陣列初始化
function ttDataClear(tableNo) {
    var i, j;
	if(tableNo == -1){
		for(j = 0; j < (Max_tbMax * 3 + 1); j++){
            ttData[j] = [];
            for(i = 0; i < itemKindMAx + 1; i++){
                ttData[j][i] = 0;
            }
        }
    }else if(tableNo == 0){  //0, 全部清除
        for(j = 0; j < (tbMax * 3 + 1); j++){
            for(i = 0; i < itemKindMAx + 1; i++){
                ttData[j][i] = 0;
            }
        }
    }else{    //清除第N個表格的資料
        for(i = 0; i < itemKindMAx + 1; i++){
            ttData[parseInt(tableNo)][i] = 0;
        }
    }
}

//素材總計陣列重新計算
function countItemAll() {
    for(var i = 0; i < itemKindMAx + 1; i++){
        ttData[0][i] = 0;
        for(var j = 1; j < parseInt(tbMax) * 3 + 1; j++){
            if(ttData[j][i]!=0)
              ttData[0][i]+=ttData[j][i];
        }
    }
}

//英靈職階選單產生
function mySelectSvtClass(noId,spanId,selectName){
    var out = "<select id=";
    out += selectName +
    " style=\"width: 100px; font-size: 12px;\"" +
    " onChange = \"selectClassChg(" + noId + ")\">" + "<br>" +
    "<option value =\"-1\">全職階</option>";

    out +=  "<option value ='0'>盾 シールダー 【Shielder】</option><br>"
        +   "<option value ='1'>劍 セイバー　　【Saber】</option><br>"
        +   "<option value ='2'>槍 ランサー 　【Lancer】</option><br>"
        +   "<option value ='3'>弓 アーチャー　【Archer】</option><br>"
        +   "<option value ='4'>騎 ライダー　 【Rider】</option><br>"
        +   "<option value ='5'>術 キャスター　【Caster】</option><br>"
        +   "<option value ='6'>殺 アサシン　 【Assassin】</option><br>"
        +   "<option value ='7'>狂 バーサーカー【Berserker】</option><br>"
        +   "<option value ='8'>裁 ルーラー 　【Ruler】</option><br>"
        +   "<option value ='9'>讐 アヴェンジャー【Avenger】</option><br>"
        +   "<option value ='10'>分 アルターエゴ【AlterEgo】</option><br>"	
        +   "<option value ='11'>月 ムーンキャンサー【MoonCancer】</option><br>"	
        +   "<option value ='12'>降 フォーリナー【Foreigner】</option><br>";
    out += "</select>";
    $("#"+spanId).html(out);
}

//英靈編號選單產生
function mySelectSvt(idNo,spanId,selectName,number){
    var i = 0;
    var continueFlag = 0;
    var svtClass = $("#selcetClassNo" + idNo).val();
    var out = "<select id=";
    out += selectName +
    " style=\"width: 200px; font-size: 12px;\"" +
    " onChange = \"selectchg(" + idNo +")\" class='select-svt-id'>" + "<br>" +
    "<option value =\"-1\">請選擇</option>";

    for(i = 0; i < number; i++){
        continueFlag = 0;
        if(i==82 || i == 148 || i == 150 || i == 151 || i == 167 || i == 239)
            continue;

        switch (svtClass) {
          case "0":
            if(i != 0)  				//盾
              continueFlag = 1;
            break;
          case "1":						//剣
            if(svtData[i].skillLevel[0].skillItem[0].image != 1)
                continueFlag = 1;
            if(i == 58 || i == 134 || i == 166 || i == 208 || i == 219 || i == 228 || i == 237 || i == 241 ) //Ruler 裁, 沖田,  BB, 始皇帝, キングプロテア, アストライア
                continueFlag = 1;
            break;
          case "2":						//槍
            if(svtData[i].skillLevel[0].skillItem[0].image != 4)
                continueFlag = 1;
			if(i == 162 || i == 232 || i == 243) //Ruler 裁 Alter Ego メルトリリス ジナコ
                continueFlag = 1;
            break;
          case "3":						//弓
            if(svtData[i].skillLevel[0].skillItem[0].image != 7)
                continueFlag = 1;
			if(i == 163 || i == 172 || i == 264 || i == 291) //Alter Ego パッションリップ Ruler シャーロック Ruler アルトリア・ペンドラゴン Ruler 卑弥呼
                continueFlag = 1;
            break;
          case "4":						//騎
            if(svtData[i].skillLevel[0].skillItem[0].image != 10)
                continueFlag = 1;
			if(i == 92 ||  i == 165 || i == 189 || i == 190 || i == 284) //Ruler 天草 MoonCancer BB, Alter Ego メカエリチャン(Ⅱ号機) 殺生院アキラ
                continueFlag = 1;
            break;
          case "5":						//術
            if(svtData[i].skillLevel[0].skillItem[0].image != 13)
                continueFlag = 1;
			if(i == 223 ||  i == 296 ) //Alter Ego シトナイ, Alter Ego 芦屋道満
                continueFlag = 1;
            break;
          case "6":						//殺
            if(svtData[i].skillLevel[0].skillItem[0].image != 16)
                continueFlag = 1;
            break;
          case "7":						//狂
            if(svtData[i].skillLevel[0].skillItem[0].image != 19)
                continueFlag = 1;
            break;
          case "8":						//裁
            if(i != 58 && i != 92 && i != 134 && i != 172 && i != 228 && i != 232 && i != 241 && i != 264 && i != 291 ) //Ruler 裁
                continueFlag = 1;
            break;
          case "9":						//讐
            if(i != 95 && i != 105 && i != 106 && i != 146 && i != 157 && i != 203 && i != 249 && i != 267 )  //Avenger 讐
                continueFlag = 1;
            break;
		  case "10":					//分
            if(i != 162 && i != 163 && i != 166 && i != 189 && i != 190 && i != 208 && i != 223 && i != 237 && i != 296)  //Alter Ego 分
                continueFlag = 1;
            break;
		  case "11":					//月
            if(i != 165 && i != 219 &&  i!= 243 &&  i!= 284)  //MoonCancer BB ジナコ 殺生院アキラ
                continueFlag = 1;
            break;
		  case "12":					//降
            if(i != 194 && i != 197 && i != 221 && i != 274 && i != 280 && i != 288)  //Foreigner 阿比, 葛飾, XX, 楊貴妃, Voyager アビゲイル〔夏〕
              continueFlag = 1;
            break;
          default:
            continueFlag = 0;
        }

        if(continueFlag){
            continue;
        }

        out +=   "<option value =\"" +
        i +
        "\">" +
        "No." +
        (i + 1) + " ";
        if(isChinese)
            out += svtChineseData[i].name;
        else
            out += svtData[i].svtName;
        out += "</option>" + "<br>";
    }
    out += "</select>";
    $("#"+spanId).html(out);
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
    " onChange = \"" + selchgName +"(0)\">" + "<br>" +
    "<option value =\"10\">請選擇</option>";

    for(i = slvMin; i < 10; i++){
        if (i < 0) continue;
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

//當英靈職階選單變動
function selectClassChg(noId){
    mySelectSvt(noId,"svt_" + noId + "_span_1","selcetNo" + noId,svtData.length);
}


//當英靈編號選單 or 最大技能等級選單變動
function selectchg(type){   //type = 1 ~ tbMax, 英靈編號選單變動 ; type = 0, 最大技能選單
    var skillNow;
    for(var i = 1; i <= tbMax ; i++){
        skillNow = parseInt($("#svt_" + i).attr("data-skillNow"));
        ttDataClear(3 * (i - 1) + skillNow);

        //
        if(type == i){
            ttDataClear(3 * (i - 1) + 1);
            ttDataClear(3 * (i - 1) + 2);
            ttDataClear(3 * (i - 1) + 3);
            $("#img_skillNo" + i + "_" + skillNow).addClass("whiteCover");
            $("#img_skillNo" + i + "_1").removeClass("whiteCover");
            $("#svt_" + i).attr("data-skillNow" , 1);
            $("#img_skillNo" + i + "_1").attr("data-min","-1");
            $("#img_skillNo" + i + "_1").attr("data-max","10");
            $("#img_skillNo" + i + "_2").attr("data-min","-1");
            $("#img_skillNo" + i + "_2").attr("data-max","0");
            $("#img_skillNo" + i + "_3").attr("data-min","-1");
            $("#img_skillNo" + i + "_3").attr("data-max","0");
            mySelectSlvMin("svt_" + i + "_span_2","selcetMin_" + i, -1, "selectchgMin(" + i + ")");
            mySelectSlvMax("svt_" + i + "_span_3","selcetMax_" + i, 10, "selectchg");
            updateAscensionTable($("#svt_" + i));
        }

        //將最小技能設為"請選擇"
        if($("#selcetMin_" + i).val() == -1)
            mySelectSlvMin("svt_" + i + "_span_2","selcetMin_" + i, 9, "selectchgMin(" + i + ")");

        myTable(i,$("#selcetNo" + i).val(),parseInt($("#selcetMin_" + i).val()),parseInt($("#selcetMax_" + i).val()),0,0);
        $("#img_svtNo_"+i).attr("src","./images/"+"svtNo_" + $("#selcetNo" + i).val() + ".png");

        //如果最大技能設為"0"，則將英靈圖片設為整行
        if($("#selcetMax_" + i).val() == 0){
            $("#img_svtNo_" + i).addClass("nonFloat");
        }else{
            $("#img_svtNo_" + i).removeClass("nonFloat");
        }

        //如果英靈設為"請選擇"，則隱藏英靈圖片
        if($("#selcetNo" + i).val()!=-1){
            $("#img_svtNo_" + i).attr("src","./images/svtNo_" + (parseInt($("#selcetNo" + i).val()) + 1) + ".png");
            $("#img_svtNo_" + i).attr("title", svtData[parseInt($("#selcetNo" + i).val())].svtName);
            $("#img_svtNo_" + i).removeClass("displayNone");
        }else{
            $("#img_svtNo_" + i).attr("src","");
            $("#img_svtNo_" + i).addClass("displayNone");
            mySelectSlvMin("svt_" + i + "_span_2","selcetMin_" + i, -1, "selectchgMin(" + i + ")");
            mySelectSlvMax("svt_" + i + "_span_3","selcetMax_" + i, 10, "selectchg");
        }
    }

    countItemAll();
    myTable2();

}

//當最小技能等級選單變動
function selectchgMin(svtNo){
    var wk_selectNo = "#selcetNo" + svtNo;
    var wk_selectMin = "#selcetMin_" + svtNo;
    var wk_selectMax = "#selcetMax_" + svtNo;
    var wk_svtNo_span = "svt_" + svtNo + "_span_3";
    var skillNow = parseInt($("#svt_" + svtNo).attr("data-skillNow"));

    //如果最小技能等於最大技能，則將英靈圖片設為整行
    if($("#selcetMax_" + svtNo).val() <= $("#selcetMin_" + svtNo).val() && $("#selcetMax_" + svtNo).val()!=10){
        $("#img_svtNo_" + svtNo).addClass("nonFloat");
    }else{
        $("#img_svtNo_" + svtNo).removeClass("nonFloat");
    }

    myTable(svtNo,$(wk_selectNo).val(),parseInt($(wk_selectMin).val()),parseInt($(wk_selectMax).val()),0,0);
    mySelectSlvMax(wk_svtNo_span,"selcetMax_" + svtNo,parseInt($(wk_selectMin).val()),"selectchg");
    ttDataClear(3 * ( svtNo - 1) + skillNow);
    myTable2();


}

function buildSImage(id, title, noclick) {
	if( id > itemKindMAx )
		id = id + 100- itemKindMAx;
    return "<img style='width: " + maxImgWidth + "px' src='images/S_" + id + ".png' title='" + title + "'" + (noclick ? "" : " onclick='itemClick(event)'") + " data-itemno='" + id + "'>";
}

//英靈素材資訊表格產生
function myTable(tableNum, svtNo, min, max, type, isSkillNumChg) {
    var i = 0, j = 0, t = 0;
    var qpTemp = 0;
    var itemMax = 0;
    var tableName = "dataTalbe" + tableNum.toString();
    var out = "<table";
    var flag = 1;
    var skillNow = parseInt($("#svt_" + tableNum).attr("data-skillNow"));

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
            //QP數存入ttData陣列
            if(tableNum < 100 && isSkillNumChg == 0){
                ttData[3 * (tableNum - 1) + skillNow][0]+=qpTemp;
            }

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
                    out += buildSImage(
                        svtData[svtNo].skillLevel[i].skillItem[j].image,
                        svtData[svtNo].skillLevel[i].skillItem[j].name
                    ) +
                    " <br> x " +
                    svtData[svtNo].skillLevel[i].skillItem[j].number;

                    //道具數存入ttData陣列
                    if(tableNum < 100 && isSkillNumChg == 0)
                      ttData[3 * (tableNum - 1) + skillNow][svtData[svtNo].skillLevel[i].skillItem[j].image]+=svtData[svtNo].skillLevel[i].skillItem[j].number;
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

// inject ascension data into summary table before rendering
function myTable2() {
    var clonedTable = JSON.parse(JSON.stringify(ttData));

    var sum = {};
    // get all items from all servants
    $("#_leftSide .svt-panel").each(function(){
        var as = getAscension(this);
        if (!as) return;

        as.forEach(function(o){
            o = o[1];
            for (var key in o) {
                if (!sum[key]) sum[key] = 0;
                sum[key] += o[key];
            }
        });
    });

    clonedTable[0][0] += sum.QP || 0;
    for (var key in sum) {
        var id = itemImage[key];
        if (!id) continue;
		
		if(id > itemKindMAx)
			id = id - 100 + itemKindMAx;

        if (!clonedTable[0][id]) clonedTable[0][id] = 0;
        clonedTable[0][id] += sum[key];
    }

    _myTable2(clonedTable, Object.keys(itemImage).length);
}

function getAscension(el) {
    var root = $root(el, ".svt-panel"),
        min = $int(root, ".asc-min"),
        max = $int(root, ".asc-max"),
        svid = $int(root, ".select-svt-id");

    if (svid <= 0) return;
    if (!ascension[svid + 1]) return;

    var ascs = [],
        i;

    for (i = min; i < max; i++) {
        ascs.push([i, ascension[svid + 1].ascension[i]]);
    }

    return ascs;
}

//右邊總計表格產生
function _myTable2(ttData, itemKindMAx) {
    var i = 0;
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


    for(i = 1; i < itemKindMAx + 1; i++){

        if (ttData[0][i] < 1 || ttData[0][i] == undefined){
            continue;
        }

        itemCount++;

        if(itemCount % 3 == 1){
            out+="<tr>";
        }
        out += "<td>"
        out += buildSImage(i, "", true);
        out += " <br> x " ;
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

function buildAscensionTable(ascs) {
    // count max rows
    var maxRow = ascs.reduce(function(m, asc){
            var l = Object.keys(asc[1]).length;
            return l > m ? l : m;
        }, 0),
        rows = [],
        i;

    for (i = 0; i < maxRow + 1; i++) {
        rows.push("<tr>");
    }

    ascs.forEach(function(o){
        var i, key;
        rows[0] += "<td>靈基 " + o[0] + " → " + (o[0] + 1) + "</td>";

        i = 1
        for (key in o[1]) {
            var imageId = itemImage[key] || key;
			
			if( imageId > itemKindMAx )
				imageId = imageId - 100 + itemKindMAx;
			
            rows[i] += "<td>" + buildSImage(imageId, key) + "<br>x " + formatNumber(o[1][key]) + "</td>";
            i++;
        }
        for (; i < maxRow + 1; i++) {
            rows[i] += "<td></td>";
        }
    });

    for (i = 0; i < maxRow; i++) {
        rows[i] += "</tr>";
    }

    return rows.join("");
}

function updateAscensionTable(el) {
    var root = $root(el, ".svt-panel");

    updateAscensionMax(root);

    // render table
    var table = root.find(".ascension-table tbody"),
        as = getAscension(root);

    table.empty();

    if (!as) return;

    table.html(buildAscensionTable(as));
}

function updateAscensionMax(e) {
    var root = $root(e, ".svt-panel"),
        min = $int(root, ".asc-min"),
        maxFirst = $int(root, ".asc-max option:first-child");

    var out = "", i;
    if (maxFirst == null) {
        for (i = min; i <= 4; i++) {
            out += "<option value='" + i + "'>" + i + "</option>";
        }
        root.find(".asc-max").html(out);
    } else if (min < maxFirst) {
        for (i = min; i < maxFirst; i++) {
            out += "<option value='" + i + "'>" + i + "</option>";
        }
        root.find(".asc-max").prepend(out);
    } else if (min > maxFirst) {
        root.find(".asc-max option:lt(" + (min - maxFirst) + ")").remove();
    }
}

function $root(el, sel) {
    if (el instanceof Event) {
        el = $(el.target);
    } else {
        el = $(el);
    }
    return el.closest(sel);
}

function $int(el, sel) {
    var val = el.find(sel).val();
    if (val == null) return null;
    return +val;
}

function formatNumber(n) {
    if (n < 1000) return n;
    return thousandComma(Math.floor(n / 1000)) + " k";
}
