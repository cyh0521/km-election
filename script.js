// ================= 數據與設定區 =================
    
    const availableElections = [

        {file: "elections/A/A2024.csv",year: "2024",type: "總統副總統",uiName: "2024年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A2020.csv",year: "2020",type: "總統副總統",uiName: "2020年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A2016.csv",year: "2016",type: "總統副總統",uiName: "2016年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A2012.csv",year: "2012",type: "總統副總統",uiName: "2012年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A2008.csv",year: "2008",type: "總統副總統",uiName: "2008年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A2004.csv",year: "2004",type: "總統副總統",uiName: "2004年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A2000.csv",year: "2000",type: "總統副總統",uiName: "2000年 總統副總統選舉",summaryData: null},
        {file: "elections/A/A1996.csv",year: "1996",type: "總統副總統",uiName: "1996年 總統副總統選舉",summaryData: null},

        {file: "elections/B/B2024.csv",year: "2024",type: "區域立委",uiName: "2024年 立法委員選舉",summaryData: null},
        {file: "elections/B/B2020.csv",year: "2020",type: "區域立委",uiName: "2020年 立法委員選舉",summaryData: null},
        {file: "elections/B/B2019.csv",year: "2019",type: "區域立委",uiName: "2019年 立法委員補選",summaryData: null},
        {file: "elections/B/B2016.csv",year: "2016",type: "區域立委",uiName: "2016年 立法委員選舉",summaryData: null},
        {file: "elections/B/B2012.csv",year: "2012",type: "區域立委",uiName: "2012年 立法委員選舉",summaryData: null},
        {file: "elections/B/B2008.csv",year: "2008",type: "區域立委",uiName: "2008年 立法委員選舉",summaryData: null},
        {file: "elections/B/B2004.csv",year: "2004",type: "區域立委",uiName: "2004年 立法委員選舉",summaryData: null},
        {file: "elections/B/B2001.csv",year: "2001",type: "區域立委",uiName: "2001年 立法委員選舉",summaryData: null},
        {file: "elections/B/B1998.csv",year: "1998",type: "區域立委",uiName: "1998年 立法委員選舉",summaryData: null},
        {file: "elections/B/B1995.csv",year: "1995",type: "區域立委",uiName: "1995年 立法委員選舉",summaryData: null},
        {file: "elections/B/B1992.csv",year: "1992",type: "區域立委",uiName: "1992年 立法委員選舉",summaryData: null},
        {file: "elections/B/B1989.csv",year: "1989",type: "區域立委",uiName: "1989年 增額立委選舉",summaryData: null},

        {file: "elections/C/C2024.csv",year: "2024",type: "不分區立委",uiName: "2024年 不分區立委選舉",summaryData: null},
        {file: "elections/C/C2020.csv",year: "2020",type: "不分區立委",uiName: "2020年 不分區立委選舉",summaryData: null},
        {file: "elections/C/C2016.csv",year: "2016",type: "不分區立委",uiName: "2016年 不分區立委選舉",summaryData: null},
        {file: "elections/C/C2012.csv",year: "2012",type: "不分區立委",uiName: "2012年 不分區立委選舉",summaryData: null},
        {file: "elections/C/C2008.csv",year: "2008",type: "不分區立委",uiName: "2008年 不分區立委選舉",summaryData: null},

        {file: "elections/D/D2005.csv",year: "2005",type: "國大代表",uiName: "2005年 任務型國代選舉",summaryData: null},
        {file: "elections/D/D1996.csv",year: "1996",type: "國大代表",uiName: "1996年 國大代表選舉",summaryData: null},
        {file: "elections/D/D1991.csv",year: "1991",type: "國大代表",uiName: "1991年 國大代表選舉",summaryData: null},

        {file: "elections/E/E2022.csv",year: "2022",type: "縣長",uiName: "2022年 縣長選舉",summaryData: null},
        {file: "elections/E/E2018.csv",year: "2018",type: "縣長",uiName: "2018年 縣長選舉",summaryData: null},
        {file: "elections/E/E2014.csv",year: "2014",type: "縣長",uiName: "2014年 縣長選舉",summaryData: null},
        {file: "elections/E/E2009.csv",year: "2009",type: "縣長",uiName: "2009年 縣長選舉",summaryData: null},
        {file: "elections/E/E2005.csv",year: "2005",type: "縣長",uiName: "2005年 縣長選舉",summaryData: null},
        {file: "elections/E/E2001.csv",year: "2001",type: "縣長",uiName: "2001年 縣長選舉",summaryData: null},
        {file: "elections/E/E1997.csv",year: "1997",type: "縣長",uiName: "1997年 縣長選舉",summaryData: null},
        {file: "elections/E/E1993.csv",year: "1993",type: "縣長",uiName: "1993年 縣長選舉",summaryData: null},

        {file: "elections/F/F2022-D3.csv",year: "2022",type: "縣議員",uiName: "2022年 縣議員選舉第3選區",summaryData: null},
        {file: "elections/F/F2022-D2.csv",year: "2022",type: "縣議員",uiName: "2022年 縣議員選舉第2選區",summaryData: null},
        {file: "elections/F/F2022-D1.csv",year: "2022",type: "縣議員",uiName: "2022年 縣議員選舉第1選區",summaryData: null},
        {file: "elections/F/F2018-D3.csv",year: "2018",type: "縣議員",uiName: "2018年 縣議員選舉第3選區",summaryData: null},
        {file: "elections/F/F2018-D2.csv",year: "2018",type: "縣議員",uiName: "2018年 縣議員選舉第2選區",summaryData: null},
        {file: "elections/F/F2018-D1.csv",year: "2018",type: "縣議員",uiName: "2018年 縣議員選舉第1選區",summaryData: null},
        {file: "elections/F/F2014-D3.csv",year: "2014",type: "縣議員",uiName: "2014年 縣議員選舉第3選區",summaryData: null},
        {file: "elections/F/F2014-D2.csv",year: "2014",type: "縣議員",uiName: "2014年 縣議員選舉第2選區",summaryData: null},
        {file: "elections/F/F2014-D1.csv",year: "2014",type: "縣議員",uiName: "2014年 縣議員選舉第1選區",summaryData: null},
        {file: "elections/F/F2009-D2.csv",year: "2009",type: "縣議員",uiName: "2009年 縣議員選舉第2選區",summaryData: null},
        {file: "elections/F/F2009-D1.csv",year: "2009",type: "縣議員",uiName: "2009年 縣議員選舉第1選區",summaryData: null},
        {file: "elections/F/F2005.csv",year: "2005",type: "縣議員",uiName: "2005年 縣議員選舉",summaryData: null},
        {file: "elections/F/F2002.csv",year: "2002",type: "縣議員",uiName: "2002年 縣議員選舉",summaryData: null},
        {file: "elections/F/F1998.csv",year: "1998",type: "縣議員",uiName: "1998年 縣議員選舉",summaryData: null},
        {file: "elections/F/F1994-D5.csv",year: "1994",type: "縣議員",uiName: "1994年 縣議員選舉第5選區",summaryData: null},
        {file: "elections/F/F1994-D4.csv",year: "1994",type: "縣議員",uiName: "1994年 縣議員選舉第4選區",summaryData: null},
        {file: "elections/F/F1994-D3.csv",year: "1994",type: "縣議員",uiName: "1994年 縣議員選舉第3選區",summaryData: null},
        {file: "elections/F/F1994-D2.csv",year: "1994",type: "縣議員",uiName: "1994年 縣議員選舉第2選區",summaryData: null},
        {file: "elections/F/F1994-D1.csv",year: "1994",type: "縣議員",uiName: "1994年 縣議員選舉第1選區",summaryData: null},
        {file: "elections/F/F1990-D5.csv",year: "1990",type: "縣議員",uiName: "1990年 諮詢代表選舉-烈嶼鄉",summaryData: null},
        {file: "elections/F/F1990-D4.csv",year: "1990",type: "縣議員",uiName: "1990年 諮詢代表選舉-金沙鎮",summaryData: null},
        {file: "elections/F/F1990-D3.csv",year: "1990",type: "縣議員",uiName: "1990年 諮詢代表選舉-金湖鎮",summaryData: null},
        {file: "elections/F/F1990-D2.csv",year: "1990",type: "縣議員",uiName: "1990年 諮詢代表選舉-金寧鄉",summaryData: null},
        {file: "elections/F/F1990-D1.csv",year: "1990",type: "縣議員",uiName: "1990年 諮詢代表選舉-金城鎮",summaryData: null},

        {file: "elections/G/G2022F.csv",year: "2022",type: "鄉鎮長",uiName: "2022年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G2022E.csv",year: "2022",type: "鄉鎮長",uiName: "2022年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G2022D.csv",year: "2022",type: "鄉鎮長",uiName: "2022年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G2022C.csv",year: "2022",type: "鄉鎮長",uiName: "2022年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G2022B.csv",year: "2022",type: "鄉鎮長",uiName: "2022年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G2022A.csv",year: "2022",type: "鄉鎮長",uiName: "2022年 金城鎮長選舉",summaryData: null},
        {file: "elections/G/G2018F.csv",year: "2018",type: "鄉鎮長",uiName: "2018年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G2018E.csv",year: "2018",type: "鄉鎮長",uiName: "2018年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G2018D.csv",year: "2018",type: "鄉鎮長",uiName: "2018年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G2018C.csv",year: "2018",type: "鄉鎮長",uiName: "2018年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G2018B.csv",year: "2018",type: "鄉鎮長",uiName: "2018年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G2018A.csv",year: "2018",type: "鄉鎮長",uiName: "2018年 金城鎮長選舉",summaryData: null},
        {file: "elections/G/G2014F.csv",year: "2014",type: "鄉鎮長",uiName: "2014年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G2014E.csv",year: "2014",type: "鄉鎮長",uiName: "2014年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G2014D.csv",year: "2014",type: "鄉鎮長",uiName: "2014年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G2014C.csv",year: "2014",type: "鄉鎮長",uiName: "2014年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G2014B.csv",year: "2014",type: "鄉鎮長",uiName: "2014年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G2014A.csv",year: "2014",type: "鄉鎮長",uiName: "2014年 金城鎮長選舉",summaryData: null},
        {file: "elections/G/G2009F.csv",year: "2009",type: "鄉鎮長",uiName: "2009年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G2009E.csv",year: "2009",type: "鄉鎮長",uiName: "2009年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G2009D.csv",year: "2009",type: "鄉鎮長",uiName: "2009年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G2009C.csv",year: "2009",type: "鄉鎮長",uiName: "2009年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G2009B.csv",year: "2009",type: "鄉鎮長",uiName: "2009年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G2009A.csv",year: "2009",type: "鄉鎮長",uiName: "2009年 金城鎮長選舉",summaryData: null},
        {file: "elections/G/G2006F.csv",year: "2006",type: "鄉鎮長",uiName: "2006年 烏坵鄉長補選",summaryData: null},
        {file: "elections/G/G2002F.csv",year: "2002",type: "鄉鎮長",uiName: "2002年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G2002E.csv",year: "2002",type: "鄉鎮長",uiName: "2002年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G2002D.csv",year: "2002",type: "鄉鎮長",uiName: "2002年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G2002C.csv",year: "2002",type: "鄉鎮長",uiName: "2002年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G2002B.csv",year: "2002",type: "鄉鎮長",uiName: "2002年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G2002A.csv",year: "2002",type: "鄉鎮長",uiName: "2002年 金城鎮長選舉",summaryData: null},
        {file: "elections/G/G2005F.csv",year: "2005",type: "鄉鎮長",uiName: "2005年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G2005E.csv",year: "2005",type: "鄉鎮長",uiName: "2005年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G2005D.csv",year: "2005",type: "鄉鎮長",uiName: "2005年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G2005C.csv",year: "2005",type: "鄉鎮長",uiName: "2005年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G2005B.csv",year: "2005",type: "鄉鎮長",uiName: "2005年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G2005A.csv",year: "2005",type: "鄉鎮長",uiName: "2005年 金城鎮長選舉",summaryData: null},
        {file: "elections/G/G1998F.csv",year: "1998",type: "鄉鎮長",uiName: "1998年 烏坵鄉長選舉",summaryData: null},
        {file: "elections/G/G1998E.csv",year: "1998",type: "鄉鎮長",uiName: "1998年 烈嶼鄉長選舉",summaryData: null},
        {file: "elections/G/G1998D.csv",year: "1998",type: "鄉鎮長",uiName: "1998年 金沙鎮長選舉",summaryData: null},
        {file: "elections/G/G1998C.csv",year: "1998",type: "鄉鎮長",uiName: "1998年 金湖鎮長選舉",summaryData: null},
        {file: "elections/G/G1998B.csv",year: "1998",type: "鄉鎮長",uiName: "1998年 金寧鄉長選舉",summaryData: null},
        {file: "elections/G/G1998A.csv",year: "1998",type: "鄉鎮長",uiName: "1998年 金城鎮長選舉",summaryData: null},

        {file: "elections/H/H2010F.csv",year: "2010",type: "鄉鎮民代表",uiName: "2010年 烏坵鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2010E.csv",year: "2010",type: "鄉鎮民代表",uiName: "2010年 烈嶼鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2010D.csv",year: "2010",type: "鄉鎮民代表",uiName: "2010年 金沙鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2010C.csv",year: "2010",type: "鄉鎮民代表",uiName: "2010年 金湖鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2010B.csv",year: "2010",type: "鄉鎮民代表",uiName: "2010年 金寧鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2010A.csv",year: "2010",type: "鄉鎮民代表",uiName: "2010年 金城鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2014F.csv",year: "2014",type: "鄉鎮民代表",uiName: "2014年 烏坵鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2014E.csv",year: "2014",type: "鄉鎮民代表",uiName: "2014年 烈嶼鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2014D.csv",year: "2014",type: "鄉鎮民代表",uiName: "2014年 金沙鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2014C.csv",year: "2014",type: "鄉鎮民代表",uiName: "2014年 金湖鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2014B.csv",year: "2014",type: "鄉鎮民代表",uiName: "2014年 金寧鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2014A.csv",year: "2014",type: "鄉鎮民代表",uiName: "2014年 金城鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2018F.csv",year: "2018",type: "鄉鎮民代表",uiName: "2018年 烏坵鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2018E.csv",year: "2018",type: "鄉鎮民代表",uiName: "2018年 烈嶼鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2018D.csv",year: "2018",type: "鄉鎮民代表",uiName: "2018年 金沙鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2018C.csv",year: "2018",type: "鄉鎮民代表",uiName: "2018年 金湖鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2018B.csv",year: "2018",type: "鄉鎮民代表",uiName: "2018年 金寧鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2018A.csv",year: "2018",type: "鄉鎮民代表",uiName: "2018年 金城鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2022F.csv",year: "2022",type: "鄉鎮民代表",uiName: "2022年 烏坵鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2022E.csv",year: "2022",type: "鄉鎮民代表",uiName: "2022年 烈嶼鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2022D.csv",year: "2022",type: "鄉鎮民代表",uiName: "2022年 金沙鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2022C.csv",year: "2022",type: "鄉鎮民代表",uiName: "2022年 金湖鎮民代表選舉",summaryData: null},
        {file: "elections/H/H2022B.csv",year: "2022",type: "鄉鎮民代表",uiName: "2022年 金寧鄉民代表選舉",summaryData: null},
        {file: "elections/H/H2022A.csv",year: "2022",type: "鄉鎮民代表",uiName: "2022年 金城鎮民代表選舉",summaryData: null},

        {file: "elections/J/J2025-A21.csv", year: "2025", type: "全國性公民投票", uiName: "2025年 全國性公投第21案（核三延役）",summaryData: null},
        {file: "elections/J/J2022-B01.csv", year: "2022", type: "全國性公民投票", uiName: "2022年 修憲複決第1案（18歲公民權）",summaryData: null},
        {file: "elections/J/J2018-A16.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第16案（廢止電業法非核家園條文）",summaryData: null},
        {file: "elections/J/J2018-A15.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第15案（國中小性平教育明定入法）",summaryData: null},
        {file: "elections/J/J2018-A14.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第14案（以民法保障同性婚姻）",summaryData: null},
        {file: "elections/J/J2018-A13.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第13案（東奧台灣正名）",summaryData: null},
        {file: "elections/J/J2018-A12.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第12案（非民法保障同性共同生活）",summaryData: null},
        {file: "elections/J/J2018-A11.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第11案（國中小不實施同志教育）",summaryData: null},
        {file: "elections/J/J2018-A10.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第10案（民法婚姻限定一男一女）",summaryData: null},
        {file: "elections/J/J2018-A09.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第09案（反日本核食進口）",summaryData: null},
        {file: "elections/J/J2018-A08.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第08案（反燃煤發電）",summaryData: null},
        {file: "elections/J/J2018-A07.csv", year: "2018", type: "全國性公民投票", uiName: "2018年 全國性公投第07案（反空污）",summaryData: null},
        {file: "elections/J/J2008-A06.csv", year: "2008", type: "全國性公民投票", uiName: "2008年 全國性公投第06案（務實返聯）",summaryData: null},
        {file: "elections/J/J2008-A05.csv", year: "2008", type: "全國性公民投票", uiName: "2008年 全國性公投第05案（台灣入聯）",summaryData: null},
        {file: "elections/J/J2008-A04.csv", year: "2008", type: "全國性公民投票", uiName: "2008年 全國性公投第04案（反貪腐）",summaryData: null},
        {file: "elections/J/J2008-A03.csv", year: "2008", type: "全國性公民投票", uiName: "2008年 全國性公投第03案（討黨產）",summaryData: null},
        {file: "elections/J/J2004-A02.csv", year: "2004", type: "全國性公民投票", uiName: "2004年 全國性公投第02案（對等談判）",summaryData: null},
        {file: "elections/J/J2004-A01.csv", year: "2004", type: "全國性公民投票", uiName: "2004年 全國性公投第01案（強化國防）",summaryData: null},

        {file: "elections/K/K2006-01.csv",year: "2006",type: "地方性公民投票",uiName: "2006年 地方性公投第1案（觀光博弈）",summaryData: null}

    

    ];

// =========================
// 行政層級定義（新）
// =========================
const ADMIN_LEVEL = {
    COUNTY: 'county',
    TOWN: 'town',
    VILLAGE: 'village'
};

// =========================
// 選舉層級規則（新）
// =========================
const ELECTION_LEVEL_RULES = {
    "總統副總統": { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "區域立委":   { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "不分區立委": { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "國大代表":   { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "縣長":       { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "縣議員":     { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "鄉鎮長":     { minLevel: ADMIN_LEVEL.TOWN,   maxLevel: ADMIN_LEVEL.VILLAGE },
    "鄉鎮民代表": { minLevel: ADMIN_LEVEL.TOWN,   maxLevel: ADMIN_LEVEL.VILLAGE },
    "村里長":     { minLevel: ADMIN_LEVEL.VILLAGE,maxLevel: ADMIN_LEVEL.VILLAGE },
    "全國性公民投票": { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE },
    "地方性公民投票": { minLevel: ADMIN_LEVEL.COUNTY, maxLevel: ADMIN_LEVEL.VILLAGE }
};

// =========================
// 偵測資料實際包含的行政層級（新）
// =========================
function detectAvailableLevels(data) {
    if (!data) return { hasCounty: false, hasTown: false, hasVillage: false };

    const hasCounty = !!data.county && Object.keys(data.county).length > 0;

    const hasTown = !!data.towns && Object.keys(data.towns).length > 0;

    const hasVillage = hasTown && Object.values(data.towns).some(t =>
        t && t.villages && Object.keys(t.villages).length > 0
    );

    return { hasCounty, hasTown, hasVillage };
}

// =========================
// 計算本次選舉「應顯示」的層級（規則 + 實際資料）（新）
// =========================
function getDisplayLevels(electionType, data) {
    const rule = ELECTION_LEVEL_RULES[electionType];
    const available = detectAvailableLevels(data);

    // 若沒有規則：保守依資料顯示（由上而下）
    if (!rule) {
        if (available.hasCounty) return [ADMIN_LEVEL.COUNTY];
        if (available.hasTown) return [ADMIN_LEVEL.TOWN];
        if (available.hasVillage) return [ADMIN_LEVEL.VILLAGE];
        return [];
    }

    const levels = [];

    // 依規則的最小層級起跳
    if (rule.minLevel === ADMIN_LEVEL.COUNTY && available.hasCounty) levels.push(ADMIN_LEVEL.COUNTY);
    if (rule.minLevel === ADMIN_LEVEL.TOWN && available.hasTown) levels.push(ADMIN_LEVEL.TOWN);
    if (rule.minLevel === ADMIN_LEVEL.VILLAGE && available.hasVillage) levels.push(ADMIN_LEVEL.VILLAGE);

    // 依規則往下延伸（且資料真的存在）
    if (rule.maxLevel === ADMIN_LEVEL.VILLAGE && available.hasVillage) {
        if (!levels.includes(ADMIN_LEVEL.TOWN) && available.hasTown) levels.push(ADMIN_LEVEL.TOWN);
        if (!levels.includes(ADMIN_LEVEL.VILLAGE)) levels.push(ADMIN_LEVEL.VILLAGE);
    } else if (rule.maxLevel === ADMIN_LEVEL.TOWN && available.hasTown) {
        if (!levels.includes(ADMIN_LEVEL.TOWN)) levels.push(ADMIN_LEVEL.TOWN);
    }

    // 排序固定：county -> town -> village
    const order = [ADMIN_LEVEL.COUNTY, ADMIN_LEVEL.TOWN, ADMIN_LEVEL.VILLAGE];
    return order.filter(l => levels.includes(l));
}

// =========================
// 判斷 town 欄位是否其實代表「全縣/全選區」總計（新）
// =========================
function isCountyPseudoTownName(name) {
    if (!name) return true; // 空值視為非鄉鎮資料
    const n = String(name).trim();
    return ['全縣', '全選區', '全縣總計', '全縣合計', '金門縣', '全縣合併'].includes(n);
}


    // *** 判斷是否為「政黨票」選舉 (不分區、任務型國代等) ***
    function isPartyListElection(electionName) {
        const partyListElections = [

            "2024年 不分區立委選舉", //範例

        ];
            // 判斷若名稱包含關鍵字，標題列隱藏推薦政黨
            if (electionName && (electionName.includes("不分區") || electionName.includes("任務型") || electionName.includes("公投")|| electionName.includes("修憲複決") || electionName.includes("政黨票"))) {
            return true;
            }
        return partyListElections.includes(electionName);
    }

    // 為每個選舉產生唯一的 ID ***
    availableElections.forEach((e, index) => {
        // 使用索引值產生如 "elec-0", "elec-1" 這樣的唯一 ID
        e.uniqueId = `elec-${index}`;
    });
    
    const electionCategories = [
	{ type: "總統副總統", icon: "總統" },
        { type: "立法委員", icon: "立委" },
        { type: "國大代表", icon: "國代" },
        { type: "縣長", icon: "縣長" },
        { type: "縣議員", icon: "議員" },
        { type: "鄉鎮長", icon: "鄉鎮" }, 
        { type: "鄉鎮民代表", icon: "代表" },
        { type: "村里長", icon: "村里" }, 
        { type: "公民投票", icon: "公投" }
    ];

    const partyColors = {
        "中國國民黨": "#3887B0",
        "民主進步黨": "#008800", 
        "台灣民眾黨": "#28C8C8",
        "親民黨": "#F27C00",
        "新黨": "#ECBE00",
        "金門高粱黨": "#990033",
        "台灣基進": "#A23D23",
        "無黨團結聯盟": "#69032B",
    	"台灣團結聯盟": "#A66000",
        "連署參選": "#8D7A96",
        "無黨籍": "#7F8C8D",
        "同意": "#0B5880",
        "不同意": "#537073",
        "default": "#537073"
    };

    let appState = {
        data: {},
        countyMetadata: {}, 
        currentLevel: 'mainMenu', 
        currentTown: null,
        currentVillage: null,
        sortConfig: { key: 'number', direction: 'asc' }, 
        globalTotalVotes: 0,
        electionName: "選舉資料",
        chartInstances: [] 
    };

    // *** 新增：取得顯示用名稱 (移除字尾數字) ***
    function getDisplayName(name) {
        if (!name) return "";
    
	// 移除名字末端的數字 (例如 "蔡建偉1" -> "蔡建偉")
	    return name.replace(/\d+$/, '');
    }

    // *** 新增：全域候選人詳細資料暫存 ***
    let globalCandidateData = {}; 
    
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, b: 0, g: 0 };
    }

    function getPartyColor(party) {
        const isIndependent = party.startsWith('無黨籍');
        if (isIndependent) {
            return partyColors[party] || partyColors['無黨籍']; 
        }
        return partyColors[party] || partyColors['default'];
    }

    function getShortPartyName(party) {
        const shortNamesMap = {
            "中國國民黨": "國民黨",
            "民主進步黨": "民進黨",
            "台灣民眾黨": "民眾黨",
            "親民黨": "親民黨","新黨": "新黨",
            "台灣團聯聯盟": "台聯黨",
            "金門高粱黨": "高粱黨","龍黨": "龍黨","教科文預算保障e聯盟": "教科文",
            "台灣基進": "台灣基進",
            "中華新住民黨": "新住民黨",
            "中國生產黨": "生產黨",
            "中華統一促進黨": "統促黨",
            "軍公教聯盟黨": "軍公教",
            "台灣工黨": "台灣工黨",
            "健保免費連線": "健保免費",
            "無黨團結聯盟": "無黨聯盟",
            "公民黨": "公民黨",
            "中華民族致公黨": "致公黨",
            "青年陽光黨": "陽光黨",
            "連署參選": "連署",
            "無黨籍-1": "無黨籍","無黨籍-2": "無黨籍",
            "無黨籍-3": "無黨籍",
            "無黨籍-4": "無黨籍",
            "無黨籍": "無黨籍",
            "default": "無"
        };
        const key = party.split('-')[0];
        return shortNamesMap[party] || shortNamesMap[key] || party; 
    }
    
    function getLongPartyName(party) {
        const longNamesMap = {
            "中國國民黨": "中國國民黨",
            "民主進步黨": "民主進步黨",
            "台灣民眾黨": "台灣民眾黨",
            "親民黨": "親民黨","新黨": "新黨",
            "台灣團結聯盟": "台灣團結聯盟",
            "金門高粱黨": "金門高粱黨","龍黨": "龍黨","教科文預算保障e聯盟": "教科文預算保障e聯盟",
            "台灣基進": "台灣基進",
            "中華新住民黨": "中華新住民黨",
            "中國生產黨": "中國生產黨",
            "中華統一促進黨": "中華統一促進黨",
            "軍公教聯盟黨": "軍公教聯盟黨",
            "台灣工黨": "台灣工黨",
            "健保免費連線": "健保免費連線",
            "無黨團結聯盟": "無黨團結聯盟",
            "公民黨": "公民黨",
            "中華民族致公黨": "中華民族致公黨",
            "青年陽光黨": "陽光黨",
            "無黨籍-1": "無黨籍","無黨籍-2": "無黨籍",
            "無黨籍-3": "無黨籍",
            "無黨籍-4": "無黨籍",
            "無黨籍": "無黨籍",
            "default": "無"
        };
        const key = party.split('-')[0];
        return longNamesMap[party] || longNamesMap[key] || party; 
    }


    const dom = {
        content: document.getElementById("content"),
        breadcrumb: document.getElementById("breadcrumb"),
        breadcrumbBottom: document.getElementById("breadcrumb-bottom"),
        header: document.querySelector('header')
    };
    
    // ================= 歷史記錄 API 輔助函式 =================
    
    function getCurrentUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            view: params.get('view') || 'main',
            type: params.get('type'),
            election: params.get('election'),
            town: params.get('town'),
            village: params.get('village')
        };
    }

// 文字正規化：避免空白/編碼差異導致找不到選舉
function normalizeText(str) {
    return (str || '')
        .toString()
        .replace(/\+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
}
    
    function updateUrl(state, title, url, push = true) {
        if (push) {
            // [新增] 在推入新歷史紀錄前，先把"當前"頁面的捲動位置存入當前的 state
            const currentState = history.state || {};
            currentState.scrollY = window.scrollY;
            history.replaceState(currentState, document.title, window.location.href);

            // 推入新的歷史紀錄
            history.pushState(state, title, url);
        } else {
            history.replaceState(state, title, url); 
        }
    }

    // ================= 候選人詳細資料載入與處理 (修改) =================
    
    async function loadCandidateData() {
        try {
            const response = await fetch('candidates.csv');
            if (!response.ok) throw new Error('無法讀取 candidates.csv');
            const text = await response.text();

            // 解析 CSV
            const rows = text.split('\n').map(r => r.trim()).filter(r => r);
    
            // 跳過標題列 (index 0)
            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].split(',');
    
                // ★ 新增：讀取 candidateId
                const candidateId = cols[0] ? cols[0].trim() : '';
                const name        = cols[1] ? cols[1].trim() : '';
                const sex         = cols[2] ? cols[2].trim() : '';
                const birthYear   = cols[3] ? cols[3].trim() : '';
                const birthPlace  = cols[4] ? cols[4].trim() : '';
                const photo       = cols[5] ? cols[5].trim() : '';
    
                if (!name || !candidateId) continue;
    
                // ★ 關鍵：把 id 一起存進去
                globalCandidateData[name] = {
                    id: candidateId,
                    sex,
                    birthYear,
                    birthPlace,
                    photo
                };
            }
        } catch (e) {
            console.warn("載入候選人資料失敗或檔案不存在", e);
        }
    }
    
    // 開啟候選人 Modal
    window.showCandidateModal = function(name, currentElectionYear) {
        // 如果是政黨票選舉，則不顯示 Modal
        if (isPartyListElection(appState.electionName)) return;

        const modal = document.getElementById('candidate-modal');
        const modalBody = document.getElementById('modal-body');
        
        // 1. 取得基本資料
        const info = globalCandidateData[name] || { sex: '未知', birthYear: '', birthPlace: '', photo: '' };
        
        // 2. 準備顯示文字：第一行 (性別．參選年紀 XX 歲)
        let line1Parts = [];
        
        // 加入性別
        if (info.sex) line1Parts.push(info.sex);
        
        // 計算並加入年紀 (參選年紀 XX 歲)
        let ageHtml = '';
        if (info.birthYear && currentElectionYear) {
            const age = parseInt(currentElectionYear) - parseInt(info.birthYear);
            ageHtml = `參選年紀 ${age} 歲`;
            line1Parts.push(ageHtml);
        }
        
        const line1Html = line1Parts.join('．'); // 用全形點連接

        // 3. 準備顯示文字：第二行 (年份／出生地 出生)
        let line2Html = "";
        if (info.birthYear || info.birthPlace) {
            const yearPart = info.birthYear ? `${info.birthYear}年` : '';
            const placePart = info.birthPlace || '';
           // 使用「／」來分隔年份與出生地，最後加上「出生」
            let combinedPart = [yearPart, placePart].filter(p => p).join('／');
           if (combinedPart) {
                 line2Html = `${combinedPart} 出生`;
            }
        }

        const photoSrc = info.photo ? `candidates/${info.photo}` : '';
        
	// 4. 搜尋參選經歷
	const historyList = [];
	
	// ★ 關鍵門禁：先確認這個人有沒有 ID
	const targetId = globalCandidateData[name]?.id;
	if (!targetId) {
	    console.warn(`找不到候選人資料：${name}`);
	} else {
	    availableElections.forEach(e => {
	        if (e.summaryData && e.summaryData.allCandidates) {
	
	            const match = e.summaryData.allCandidates.find(c =>
	                globalCandidateData[c.name]?.id === targetId
	            );
	
	            if (match) {
	                historyList.push({
	                    year: e.year,
	                    electionName: e.uiName,
	                    party: match.party,
	                    isWinner: match.isWinner,
	                    isIncumbent: match.isIncumbent
	                });
	            }
	        }
	    });
	}

        historyList.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        
        let historyHtml = ''; 
        if (historyList.length > 0) {
            historyHtml += `<div class="history-title">參選經歷</div><ul class="history-list">`;
            historyList.forEach(h => {
                const electionNameWithoutYear = h.electionName.replace(/^\d+年\s*/, '');    const resultClass = h.isWinner ? 'result-won' : 'result-lost';
                const resultText = h.isWinner ? '當選' : '未當選';
                const partyName = getLongPartyName(h.party);
                historyHtml += `
                    <li class="history-item">
                        <div>
                            <span class="history-year-tag">${h.year}</span>
                            <span class="history-name">${electionNameWithoutYear}</span> <span class="history-party">${partyName}</span>
                        </div>
                        <div class="history-result ${resultClass}">
                            ${resultText}
                        </div>
                    </li>
                `;
            });
            historyHtml += `</ul>`;
        } else {
            historyHtml = `<div style="color:#999; margin-top:20px;">無其他參選紀錄</div>`;
        }
        
    // 5. 組合 HTML 
        const imgDisplay = photoSrc ? `<img src="${photoSrc}" class="profile-photo" alt="${name}">` : `<div class="profile-photo" style="display:flex;align-items:center;justify-content:center;font-size:40px;color:#ccc;">👤</div>`;
        
        modalBody.innerHTML = `
            <div class="profile-header">
                ${imgDisplay}
                <div class="profile-info">
                    <h2>${getDisplayName(name)}</h2>
                    <div class="profile-detail">
                        <div style="margin-bottom: 2px;">
                            ${line1Html}
                        </div>
                        <div style="color: var(--text-sub);">
                            ${line2Html}
                        </div>
                    </div>
                </div>
            </div>
            ${historyHtml}
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };
    
    window.closeModal = function() {
        document.getElementById('candidate-modal').classList.remove('active');
        document.body.style.overflow = '';
    };

    // ================= 資料載入與解析 =================
    
    function parseCSV(text) {
    const rows = text.split('\n')
        .map(r => r.trim())
        .filter(r => r)
        .map(r => r.split(','));

    if (rows.length < 4) return;

    // 讀取 A1 (選舉名稱) 和 B1 (投票日期)
    const electionNameFromCSV = rows[0][0] ? rows[0][0].trim() : '';
    const electionDateFromCSV = rows[0][1] ? rows[0][1].trim() : '';

    // 解析候選人欄位範圍（從第 3 欄開始連續）
    const headerRowIndices = [];
    let currentIdx = 2;
    while (rows[0][currentIdx] && rows[1][currentIdx]) {
        headerRowIndices.push(currentIdx);
        currentIdx++;
    }

    const seatsCount = rows[1] && rows[1][0] ? rows[1][0].trim() : "";

    const VOTES_COL = currentIdx;
    const INVALID_COL = currentIdx + 1;
    const ELIGIBLE_COL = currentIdx + 2;

    const candInfo = [];
    let independentCounter = 1;

    headerRowIndices.forEach(colIndex => {
        const number = rows[0][colIndex] ? rows[0][colIndex].trim() : '';
        let name = rows[1][colIndex] ? rows[1][colIndex].trim() : '';
        let party = rows[2][colIndex] ? rows[2][colIndex].trim() : '';

        // 處理 [] 中的文字
        const bracketMatch = name.match(/\[(.*?)\]/);
        const bracketText = bracketMatch ? bracketMatch[1] : null;

        const isWomenQuota = name.includes('*!');
        const isIncumbent = name.includes('#');
        const isWinner = name.includes('*') || isWomenQuota;

        // 清理名字，移除所有標記
        name = name.replace(/\[.*?\]/g, '').replace('*!', '').replace('*', '').replace('#', '').trim();
        party = party === '無' ? '無黨籍' : party;

        if (name && number) {
            if (party === '無黨籍') {
                if (!partyColors[`無黨籍-${independentCounter}`] && independentCounter <= 4) {
                    partyColors[`無黨籍-${independentCounter}`] = partyColors['無黨籍'];
                }
                party = `無黨籍-${independentCounter}`;
                independentCounter++;
            }

            candInfo.push({
                number: String(number),
                name,
                party,
                colIndex,
                isWinner,
                isWomenQuota,
                isIncumbent,
                bracketText
            });
        }
    });

    const candidates = {};
    const towns = {};
    const townOrder = [];

    let globalValidVotes = 0;
    let globalInvalidVotes = 0;
    let globalEligibleVoters = 0;

    const parseNum = (val) => parseInt(String(val || '').replace(/[^0-9]/g, '')) || 0;

    for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < (ELIGIBLE_COL + 1)) continue;

        // 跳過表頭/分隔列
        if ((row[0] || '').includes('鄉鎮')) continue;

        const townRaw = (row[0] || '').trim();
        const village = (row[1] || '').trim();

        const validVotes = parseNum(row[VOTES_COL]);
        const invalidVotes = parseNum(row[INVALID_COL]);
        const eligibleVoters = parseNum(row[ELIGIBLE_COL]);

        // 無論是否有鄉鎮/村里，都要計入全縣總計
        globalValidVotes += validVotes;
        globalInvalidVotes += invalidVotes;
        globalEligibleVoters += eligibleVoters;

        const isTownRow = townRaw && !isCountyPseudoTownName(townRaw);
        const town = townRaw;

        // ✅ 鄉鎮層：只有真的是鄉鎮列，才建立 towns 結構並累加
        if (isTownRow) {
            if (!towns[town]) {
                towns[town] = {
                    villages: {},
                    validVotes: 0,
                    invalidVotes: 0,
                    eligibleVoters: 0,
                    candidates: {}
                };
                townOrder.push(town);
            }

            towns[town].validVotes += validVotes;
            towns[town].invalidVotes += invalidVotes;
            towns[town].eligibleVoters += eligibleVoters;

            // ✅ 村里層：village 有值才建立
            if (village) {
                if (!towns[town].villages[village]) {
                    towns[town].villages[village] = {
                        validVotes: 0,
                        invalidVotes: 0,
                        eligibleVoters: 0,
                        candidates: {}
                    };
                }
                towns[town].villages[village].validVotes += validVotes;
                towns[town].villages[village].invalidVotes += invalidVotes;
                towns[town].villages[village].eligibleVoters += eligibleVoters;
            }
        }

        // 候選人票數累加（全縣）
        candInfo.forEach(c => {
            const votes = parseNum(row[c.colIndex]);

            if (!candidates[c.name]) {
                candidates[c.name] = {
                    number: c.number,
                    party: c.party,
                    votes: 0,
                    isWinner: c.isWinner,
                    isWomenQuota: c.isWomenQuota,
                    isIncumbent: c.isIncumbent,
                    bracketText: c.bracketText
                };
            }
            candidates[c.name].votes += votes;

            // 鄉鎮/村里（只有 isTownRow 才寫）
            if (isTownRow) {
                if (!towns[town].candidates[c.name]) {
                    towns[town].candidates[c.name] = {
                        number: c.number,
                        party: c.party,
                        votes: 0,
                        isWinner: c.isWinner,
                        isWomenQuota: c.isWomenQuota,
                        isIncumbent: c.isIncumbent,
                        bracketText: c.bracketText
                    };
                }
                towns[town].candidates[c.name].votes += votes;

                if (village) {
                    if (!towns[town].villages[village].candidates[c.name]) {
                        towns[town].villages[village].candidates[c.name] = {
                            number: c.number,
                            party: c.party,
                            votes: 0,
                            isWinner: c.isWinner,
                            isWomenQuota: c.isWomenQuota,
                            isIncumbent: c.isIncumbent,
                            bracketText: c.bracketText
                        };
                    }
                    towns[town].villages[village].candidates[c.name].votes += votes;
                }
            }
        });
    }

    appState.data = {
        county: candidates,
        towns: towns,
        townOrder: [...new Set(townOrder)]
    };

    appState.countyMetadata = {
        validVotes: globalValidVotes,
        invalidVotes: globalInvalidVotes,
        eligibleVoters: globalEligibleVoters,
        seatsCount: seatsCount,
        electionNameFromCSV: electionNameFromCSV,
        electionDateFromCSV: electionDateFromCSV
    };

    appState.globalTotalVotes = globalValidVotes;
}

function loadData(file, uiName, pushState = true) {
        dom.content.innerHTML = `<div class="loading-state">正在載入 ${uiName} 完整數據...</div>`;

        appState.electionName = uiName;
        // ✅ 若此選舉屬於鄉鎮長/鄉鎮民代表：確保類型存在（鄉鎮名稱由子選單先行設定）
        const currentEle = availableElections.find(e => e.uiName === uiName);
        if (currentEle && (currentEle.type === '鄉鎮長' || currentEle.type === '鄉鎮民代表')) {
            appState.currentTownshipType = currentEle.type;
            // appState.currentTownshipName 會在 renderElectionListByTown() 由使用者選擇鄉鎮時設定
        }        fetch(file)
            .then(r => {
                if (!r.ok) throw new Error("檔案讀取失敗，請檢查檔案名稱與路徑。");
                return r.text();
            })
            .then(csvText => {
                parseCSV(csvText);

                // 重置排序與圖表
                appState.sortConfig = { key: 'number', direction: 'asc' };
                appState.chartInstances.forEach(chart => chart.destroy());
                appState.chartInstances = [];

                const currentElectionObj = availableElections.find(e => e.uiName === appState.electionName);
                const electionType = currentElectionObj ? currentElectionObj.type : '';
                const displayLevels = getDisplayLevels(electionType, appState.data);

                // 若第一層是鄉鎮（例如：鄉鎮長 / 鄉鎮民代表），直接進入第一個鄉鎮
                if (displayLevels.length > 0 && displayLevels[0] === ADMIN_LEVEL.TOWN) {
                    const firstTown = appState.data && appState.data.townOrder ? appState.data.townOrder[0] : null;
                    if (firstTown) {
                        renderTown(firstTown, true, pushState);
                        return;
                    }
                }

                // 其他情況預設進入縣層
                renderCounty(true, pushState);
            })
            .catch(error => {
                console.error("載入錯誤:", error);
                dom.content.innerHTML = `<div class="loading-state" style="color:red">讀取 ${file} 失敗: ${error.message}<br>請檢查檔案是否上傳成功。</div>`;
            });
}

function extractCountySummary(text) {
        const rows = text.split('\n').map(r => r.trim()).filter(r => r).map(r => r.split(','));

        if (rows.length < 4) return null;

        const headerRowIndices = []; 
        let currentIdx = 2;
        while(rows[0][currentIdx] && rows[1][currentIdx]) {
            headerRowIndices.push(currentIdx);
            currentIdx++;
        }
        
        const seatsCount = rows[1] && rows[1][0] ? rows[1][0].trim() : "";
        
        const VOTES_COL = currentIdx; 
        const INVALID_COL = currentIdx + 1;
        const ELIGIBLE_COL = currentIdx + 2;

        const candInfo = [];
        let independentCounter = 1;
        
        headerRowIndices.forEach(colIndex => {
            const number = rows[0][colIndex] ? rows[0][colIndex].trim() : '';
            let name = rows[1][colIndex] ? rows[1][colIndex].trim() : '';
            let party = rows[2][colIndex] ? rows[2][colIndex].trim() : '';
           
            // *** 修改：處理 [] 中的文字 ***
            const bracketMatch = name.match(/\[(.*?)\]/);
            const bracketText = bracketMatch ? bracketMatch[1] : null;

            const isWomenQuota = name.includes('*!');
            const isIncumbent = name.includes('#');
            const isWinner = name.includes('*') || isWomenQuota;

            name = name.replace(/\[.*?\]/g, '').replace('*!', '').replace('*', '').replace('#', '').trim();
            party = party === '無' ? '無黨籍' : party;

            if (name && number) {
                 if (party === '無黨籍') {
                    if (!partyColors[`無黨籍-${independentCounter}`] && independentCounter <= 4) {
                       partyColors[`無黨籍-${independentCounter}`] = partyColors['無黨籍'];        }
                    party = `無黨籍-${independentCounter}`;
                    independentCounter++;
                }
                candInfo.push({ number: String(number), name, party, colIndex, isWinner, isWomenQuota, isIncumbent, bracketText });}
        });
        
        const candidates = {}; 
        let globalValidVotes = 0; 
        let globalInvalidVotes = 0; 
        let globalEligibleVoters = 0; 
        
        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];
           if (row.length < (ELIGIBLE_COL + 1) || !row[0] || row[0].includes("鄉鎮")) continue;

            const parseNum = (val) => parseInt(String(val).replace(/[^0-9]/g, '')) || 0;

            const validVotes = parseNum(row[VOTES_COL]);const invalidVotes = parseNum(row[INVALID_COL]);const eligibleVoters = parseNum(row[ELIGIBLE_COL]);
            globalValidVotes += validVotes;
            globalInvalidVotes += invalidVotes;
            globalEligibleVoters += eligibleVoters;
           candInfo.forEach(c => {
                const votes = parseNum(row[c.colIndex]);
                if (!candidates[c.name]) candidates[c.name] = { number: c.number, party: c.party, votes: 0, isWinner: c.isWinner, isWomenQuota: c.isWomenQuota, isIncumbent: c.isIncumbent, bracketText: c.bracketText };    candidates[c.name].votes += votes;
            });
        }
        
        let allCandidatesList = Object.keys(candidates).map(key => ({ name: key, ...candidates[key] }));
        
        return {
            allCandidates: allCandidatesList,
            metadata: {
                validVotes: globalValidVotes,
                invalidVotes: globalInvalidVotes,
                eligibleVoters: globalEligibleVoters,
                seatsCount: seatsCount}
        };
    }
    
    async function loadAllElectionSummaries(elections) {
        const summaryPromises = elections.map(async e => {
            try {
                const response = await fetch(e.file);
                if (!response.ok) throw new Error("檔案讀取失敗，請檢查檔案名稱與路徑。");
                const csvText = await response.text();
                   const summary = extractCountySummary(csvText);
                   if (summary) {
                    const initialSortConfig = { key: 'number', direction: 'asc' };
                    const sortedAllCands = getSortedCandidatesFromList(summary.allCandidates, initialSortConfig);
                           e.summaryData = {
                        allCandidates: sortedAllCands,
                        metadata: summary.metadata,
                        topCandidates: sortedAllCands.slice(0, 3),
                        sortConfig: initialSortConfig        };
                       } else {
                    e.summaryData = null;
                }
            } catch (error) {
                console.error(`載入 ${e.file} 摘要失敗:`, error.message);
                e.summaryData = null;}
            return e;
        });

        await Promise.all(summaryPromises);
    }

    // ================= 排序與更新邏輯 =================
    
    window.sortTable = function(key) {
        
        const currentKey = appState.sortConfig.key;
        const currentDirection = appState.sortConfig.direction;
        
        let newDirection = 'desc'; 
        
        if (key === 'number' || key === 'name' || key === 'party') {
             newDirection = 'asc'; 
        }

        if (currentKey === key) {
            newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        }

        appState.sortConfig = { key: key, direction: newDirection };

        if (appState.currentLevel === 'county') {
            renderCounty(false, false); 
        } else if (appState.currentLevel === 'town') {
            renderTown(appState.currentTown, false, false); 
        } else if (appState.currentLevel === 'village') {
            renderVillage(appState.currentTown, appState.currentVillage, false, false);
        }
    };
    
    window.sortTableInCard = function(cardId, key) {
        
        const targetUniqueId = cardId.replace('summary-', '');
        const election = availableElections.find(e => e.uniqueId === targetUniqueId);

        if (!election || !election.summaryData) return;
        
        let { sortConfig, allCandidates, metadata } = election.summaryData;
        
        const currentKey = sortConfig.key;
        const currentDirection = sortConfig.direction;
        
        let newDirection = 'desc'; 
        
        if (key === 'number' || key === 'name' || key === 'party') {
             newDirection = 'asc'; 
        }

        if (currentKey === key) {
            newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        }

        sortConfig = { key: key, direction: newDirection }; 
        election.summaryData.sortConfig = sortConfig; 

        const sortedList = getSortedCandidatesFromList(allCandidates, sortConfig);
        
        const isPartyList = isPartyListElection(election.uiName);
        
        updateTableContent(cardId, sortedList, metadata.validVotes, true, election.year, isPartyList); 
        
        updateSortIconsInCard(cardId, sortConfig);
    };

    function getSortedCandidates(candObj) {
        let list = Object.keys(candObj).map(key => ({ name: key, ...candObj[key] }));
        const { key, direction } = appState.sortConfig;
        
        list.sort((a, b) => {
            let valA = a[key], valB = b[key];

            if (key === 'number' || key === 'votes') {    valA = parseInt(valA) || 0;    valB = parseInt(valB) || 0;
            } else if (typeof valA === 'string') {
                 valA = valA.toLowerCase();
                 valB = valB.toLowerCase();
            }

            let comparison = 0;
            if (valA < valB) {
                comparison = -1;
            } else if (valA > valB) {
                comparison = 1;
            }

            return direction === 'asc' ? comparison : comparison * -1;
        });
        
        return list;
    }
    
    function getSortedCandidatesFromList(list, sortConfig = { key: 'votes', direction: 'desc' }) {
        let { key, direction } = sortConfig;
        
        list.sort((a, b) => {
            let valA = a[key], valB = b[key];

            if (key === 'number' || key === 'votes') {    valA = parseInt(valA) || 0;    valB = parseInt(valB) || 0;
            } else if (typeof valA === 'string') {
                 valA = valA.toLowerCase();
                 valB = valB.toLowerCase();
            }

            let comparison = 0;
            if (valA < valB) {
                comparison = -1;
            } else if (valA > valB) {
                comparison = 1;
            }

            return direction === 'asc' ? comparison : comparison * -1;
        });
        
        return list;
    }
    
    /**
     * 生成表格內容 HTML (帶有動畫屬性)
     */
    function generateTableBodyHTML(candidates, validVotes, animate, currentElectionYear, isPartyList) {
        return candidates.map(c => {
            const rate = validVotes > 0 ? (c.votes / validVotes * 100).toFixed(2) : 0;
            const partyColorHex = getPartyColor(c.party);
            const rgb = hexToRgb(partyColorHex);
            const lightColorRGBA = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.30)`;
            const rowStyle = `
                background-image: linear-gradient(
                    to right,        ${lightColorRGBA} 0%,        ${lightColorRGBA} 100%
                );
                --bar-width: ${rate}%;
            `;
            const animateClass = animate ? 'animate-bar-grow' : '';
            const badgeClass = c.isWinner ? 'number-badge is-winner' : 'number-badge';const partyLongName = getLongPartyName(c.party);const partyShortName = getShortPartyName(c.party);
            
            const womenQuotaBadge = c.isWomenQuota    ? '<div class="women-quota-badge">婦女保障名額</div>'    : '';
            
            // *** 修改：渲染 [] 內容標籤 ***
            const bracketBadge = c.bracketText ? `<div class="bracket-label-badge">${c.bracketText}</div>` : '';

            const incumbentBadge = c.isIncumbent    ? '<span class="incumbent-badge">現</span>'    : '';
            const nameClickAction = isPartyList ? 'event.stopPropagation()' : `event.stopPropagation(); showCandidateModal('${c.name}', '${currentElectionYear || ''}')`;
            const nameLinkClass = isPartyList ? 'candidate-name' : 'candidate-name candidate-link';
            const partyCellClass = isPartyList ? 'col-party hidden-party' : 'party-cell col-party';
            const partyCellHtml = `
                <td class="${partyCellClass}">
                    <span class="party-badge party-long" style="background:${partyColorHex}">${partyLongName}</span>
                    <span class="party-badge party-short" style="background:${partyColorHex}">${partyShortName}</span>
                </td>
            `;

            return `
                <tr style="${rowStyle}" class="${animateClass}">
                    <td class="number-cell col-number">
                        <span class="${badgeClass}">${c.number}</span>
                    </td>
                    <td>
			<span class="${nameLinkClass}" onclick="${nameClickAction}">
  			  ${getDisplayName(c.name)}${incumbentBadge}
			</span>
                        ${womenQuotaBadge}
                        ${bracketBadge}
                    </td>
                    ${partyCellHtml}
                    <td style="text-align:right">${c.votes.toLocaleString()}</td>
                    <td style="text-align:right;">${rate}%</td> </tr>
            `;
        }).join('');
    }
    
    /**
     * 更新表格內容 (用於排序/更新時)
     */
    function updateTableContent(cardId, candidates, validVotes, triggerAnimation = false, currentElectionYear, isPartyList = false) {
        const mainTableBody = document.querySelector(`#card-${cardId} table tbody`); 
        if (mainTableBody) {
            mainTableBody.innerHTML = generateTableBodyHTML(candidates, validVotes, triggerAnimation, currentElectionYear, isPartyList);
        }
    }
    
    function updateSortIcons() {
        const { key, direction } = appState.sortConfig;
        document.querySelectorAll('th .sort-icon').forEach(icon => {
            const iconKey = icon.getAttribute('data-key');
            icon.className = 'sort-icon';
            if (iconKey === key) {
                icon.classList.add(direction);
            }
        });
    }

    function updateSortIconsInCard(cardId, sortConfig) {
        const { key, direction } = sortConfig;
        const cardElement = document.getElementById(`card-${cardId}`);
        if (!cardElement) return;

        cardElement.querySelectorAll('th .sort-icon').forEach(icon => {
            const iconKey = icon.getAttribute('data-key');
            icon.className = 'sort-icon';
            if (iconKey === key) {
                icon.classList.add(direction);
            }
        });
    }

    // ================= 頁面渲染函式 =================
    
    function generateSummaryCardHTML(election) {
        if (!election.summaryData) {
            return `<div class="card failed">
                <div class="card-title">${election.uiName}</div>
                <div class="card-stats" style="color:red; margin-left:0;">資料載入失敗或檔案遺失。</div>
            </div>`;
        }
        const { allCandidates, metadata, sortConfig } = election.summaryData;
        
        const cardId = `summary-${election.uniqueId}`;

        return generateCardHTML(
            cardId,election.uiName,allCandidates,metadata,true,`loadData('${election.file}', '${election.uiName}', true)`,true,true, sortConfig,
            true,
            election.year 
        );
    }

    window.renderMainMenu = function(pushState = true) { 
        
        const url = `?view=main`;
        const state = { view: 'main' };
        updateUrl(state, "金門選舉資料庫 - 首頁", url, pushState); 

        appState.currentLevel = 'mainMenu';
        
        // [修改] 捲動邏輯：如果是上一頁(pushState=false)，則恢復記憶的位置
        if (pushState) {
            window.scrollTo(0, 0); 
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb(); 
        
        appState.chartInstances.forEach(chart => chart.destroy()); 
        appState.chartInstances = [];
        
        let html = '';

        html += `<div class="main-section">
            <div class="menu-section-title">依選舉及公投類別瀏覽</div>
            <div class="main-menu-grid">`;
        
    electionCategories.forEach(cat => {
        // 判斷：如果是公民投票或立法委員，點擊時執行對應的 SubMenu
        let clickAction;
        if (cat.type === '公民投票') {
             clickAction = `renderReferendumSubMenu(true)`;
        } else if (cat.type === '立法委員') {
             clickAction = `renderLegislatorSubMenu(true)`;
        } else if (cat.type === '鄉鎮長' || cat.type === '鄉鎮民代表') {
             clickAction = `renderTownshipSubMenu('${cat.type}', true)`;
        } else {
             clickAction = `renderElectionList('${cat.type}', true)`;
        }

        html += `<div class="menu-button no-icon" onclick="${clickAction}">
            <span class="menu-text">${cat.type}</span>
        </div>`;
    });

        html += `</div></div>`;

        const recentElections = [...availableElections].sort((a, b) => {
            const yearA = parseInt(a.year);
            const yearB = parseInt(b.year);
            if (yearA !== yearB) {
                return yearB - yearA;}
            return a.uiName.localeCompare(b.uiName, 'zh-TW');

        }).slice(0, 8); 

        if (recentElections.length > 0) {
            html += `<div class="main-section">
                <div class="menu-section-title">近期選舉</div>
                <div class="election-list-grid">`;
           recentElections.forEach(e => {
                html += generateSummaryCardHTML(e);
            });
            html += `</div></div>`;
        }

        dom.content.innerHTML = html;
    };

    window.renderReferendumSubMenu = function(pushState = true) {
        
        const url = `?view=referendumMenu`;
        const state = { view: 'referendumMenu' };
        updateUrl(state, "金門選舉資料庫 - 公民投票類別", url, pushState); 

        appState.currentLevel = 'referendumMenu'; 
        
        if (pushState) {
            window.scrollTo(0, 0); 
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb(); 
        
        appState.chartInstances.forEach(chart => chart.destroy()); 
        appState.chartInstances = [];
        
        let html = '';

	html += `<div class="main-section">
            <div class="menu-section-title">請選擇公投類別</div>
            <div class="main-menu-grid">
                   <div class="menu-button no-icon" onclick="renderElectionList('全國性公民投票', true)">
                    <span class="menu-text">全國性公民投票</span>
                </div>

                <div class="menu-button no-icon" onclick="renderElectionList('地方性公民投票', true)">
                    <span class="menu-text">地方性公民投票</span>
                </div>

            </div>
        </div>`;

        dom.content.innerHTML = html;
    };

    window.renderLegislatorSubMenu = function(pushState = true) {
        
        const url = `?view=legislatorMenu`;
        const state = { view: 'legislatorMenu' };
        updateUrl(state, "金門選舉資料庫 - 立法委員類別", url, pushState); 

        appState.currentLevel = 'legislatorMenu'; 
        
        if (pushState) {
            window.scrollTo(0, 0); 
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb(); 
        
        appState.chartInstances.forEach(chart => chart.destroy()); 
        appState.chartInstances = [];
        
        let html = '';

	html += `<div class="main-section">
            <div class="menu-section-title">請選擇立委類別</div>
            <div class="main-menu-grid">
                   <div class="menu-button no-icon" onclick="renderElectionList('區域立委', true)">
                    <span class="menu-text">區域立委</span>
                </div>

                <div class="menu-button no-icon" onclick="renderElectionList('不分區立委', true)">
                    <span class="menu-text">不分區立委</span>
                </div>

            </div>
        </div>`;

        dom.content.innerHTML = html;
    };
    
    

    // ================= 鄉鎮長 / 鄉鎮民代表 子選單（新增） =================
    window.renderTownshipSubMenu = function(type, pushState = true) {
        const url = `?view=townshipMenu&type=${encodeURIComponent(type)}`;
        const state = { view: 'townshipMenu', type: type };
        updateUrl(state, `金門選舉資料庫 - ${type}（依鄉鎮）`, url, pushState);

        appState.currentLevel = 'townshipMenu';
        appState.currentTownshipType = type;
        appState.currentTownshipName = null;

        if (pushState) {
            window.scrollTo(0, 0);
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb();

        appState.chartInstances.forEach(chart => chart.destroy());
        appState.chartInstances = [];

        const towns = ["金城鎮","金寧鄉","金湖鎮","金沙鎮","烈嶼鄉","烏坵鄉"];

        let html = `<div class="main-section">
            <div class="menu-section-title">${type}：請選擇鄉鎮</div>
            <div class="main-menu-grid township-submenu">`;

        towns.forEach(t => {
            html += `<div class="menu-button no-icon" onclick="renderElectionListByTown('${type}', '${t}', true)">
<span class="menu-text">${t}</span>
            </div>`;
        });

        html += `</div></div>`;
        dom.content.innerHTML = html;
    };

    // ================= 鄉鎮長 / 鄉鎮民代表：依鄉鎮列出選舉（新增） =================
    window.renderElectionListByTown = function(type, townName, pushState = true) {

        const url = `?view=townshipList&type=${encodeURIComponent(type)}&town=${encodeURIComponent(townName)}`;
        const state = { view: 'townshipList', type: type, town: townName };
        updateUrl(state, `金門選舉資料庫 - ${type}（${townName}）`, url, pushState);

        appState.currentLevel = 'townshipList';
        appState.currentTownshipType = type;
        appState.currentTownshipName = townName;

        if (pushState) {
            window.scrollTo(0, 0);
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb();

        appState.chartInstances.forEach(chart => chart.destroy());
        appState.chartInstances = [];

        const matchingElections = availableElections
            .filter(e => e.type === type && (e.uiName || '').includes(townName))
            .sort((a, b) => {
                const yearA = parseInt(a.year);
                const yearB = parseInt(b.year);
                if (yearA !== yearB) return yearB - yearA;
                return a.uiName.localeCompare(b.uiName, 'zh-TW');
            });

        let html = `<div class="main-section">
            <div class="menu-section-title">${type}（${townName}）選舉列表</div>
        </div>`;

        if (matchingElections.length > 0) {
            html += `<div class="election-list-grid">`;
            matchingElections.forEach(e => {
                html += generateSummaryCardHTML(e);
            });
            html += `</div>`;
        } else {
            html += `<div class="loading-state" style="padding:40px;">此鄉鎮目前無資料可供查詢。</div>`;
        }

        dom.content.innerHTML = html;
    };

window.renderElectionList = function(type, pushState = true) { 
        
        const url = `?view=list&type=${encodeURIComponent(type)}`;
        const state = { view: 'list', type: type };
        updateUrl(state, `金門選舉資料庫 - ${type} 列表`, url, pushState); 

        appState.currentLevel = 'electionList';
        appState.currentTown = type; 

        if (pushState) {
            window.scrollTo(0, 0); 
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb(); 
        
        appState.chartInstances.forEach(chart => chart.destroy()); 
        appState.chartInstances = [];

        const matchingElections = availableElections.filter(e => e.type === type);
        matchingElections.sort((a, b) => {
             const yearA = parseInt(a.year);
             const yearB = parseInt(b.year);
             if (yearA !== yearB) {
                 return yearB - yearA; }
             return a.uiName.localeCompare(b.uiName, 'zh-TW'); 
        });

        let html = `<div class="main-section">
            <div class="menu-section-title">${type} 選舉列表</div>
        </div>`;
        
        if (matchingElections.length > 0) {
            html += `<div class="election-list-grid">`;
            matchingElections.forEach(e => {
                html += generateSummaryCardHTML(e);});
            html += `</div>`;
        } else {
             html += `<div class="loading-state" style="padding:40px;">該類別目前無資料可供查詢。</div>`;
        }

        dom.content.innerHTML = html;
    };

    
window.renderCounty = function(shouldScroll = true, pushState = true) {
        const candidates = getSortedCandidates(appState.data.county); 
        const metadata = appState.countyMetadata;
        const currentElectionObj = availableElections.find(e => e.uiName === appState.electionName);
        const currentYear = currentElectionObj ? currentElectionObj.year : "";
        const electionType = currentElectionObj ? currentElectionObj.type : '';
        const displayLevels = getDisplayLevels(electionType, appState.data);

        const shouldRenderTowns = displayLevels.includes(ADMIN_LEVEL.TOWN);
        const shouldRenderVillages = displayLevels.includes(ADMIN_LEVEL.VILLAGE);
        const shouldRenderCounty = displayLevels.includes(ADMIN_LEVEL.COUNTY);

        const isPartyList = isPartyListElection(appState.electionName);

        // 鄉鎮長：特殊顯示（全鄉鎮總表 + 村里列表），但只有資料真的有村里時才顯示村里
        const isTownshipMayor = (currentElectionObj && currentElectionObj.type === "鄉鎮長");

        if (!shouldScroll) {
            // 更新排序內容 (不捲動)
            
            // 1. 更新上方總表 (如果是鄉鎮長，或非地方型選舉)
            if (isTownshipMayor || shouldRenderCounty) {
                 updateTableContent('county-main', candidates, metadata.validVotes, true, currentYear, isPartyList);
            }
            
            // 2. 更新下方列表
            if (isTownshipMayor) {
                // 鄉鎮長：更新村里列表
                const townName = appState.data.townOrder[0];
                if (townName && appState.data.towns[townName]) {
                    const townData = appState.data.towns[townName];
                    if (shouldRenderVillages) {
                    Object.keys(townData.villages || {}).forEach(village => {
                         const vData = townData.villages[village];
                         const vCands = getSortedCandidates(vData.candidates);
                         updateTableContent(`village-${village}`, vCands, vData.validVotes, true, currentYear, isPartyList);
                    });
                }
                }
            } else if (shouldRenderTowns) {
                // 一般選舉：更新鄉鎮列表
                appState.data.townOrder.forEach(town => {
                    const townData = appState.data.towns[town];
                    const townCands = getSortedCandidates(townData.candidates);
                    updateTableContent(`town-${town}`, townCands, townData.validVotes, true, currentYear, isPartyList);
                });
            }
            updateSortIcons();
            return; 
        }

        if (pushState) {
            const url = `?view=county&election=${encodeURIComponent(appState.electionName)}`;
            const state = { view: 'county', election: appState.electionName };
            updateUrl(state, `金門選舉資料庫 - ${appState.electionName}`, url, pushState);
        }
        
        appState.currentLevel = 'county';
        appState.currentTown = null;
        
        if (pushState) {
            window.scrollTo(0, 0); 
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb();

        let html = `<div class="main-section">
            <div class="section-header"><span class="section-title">${appState.electionName}</span></div>
        `;
        
        // 上方總計區塊邏輯：
        // 1. 如果是鄉鎮長選舉，顯示「全鄉鎮開票結果」
        // 2. 如果不是地方型選舉 (e.g. 縣長、立委)，顯示「全縣開票結果」
        // 3. 其他地方型 (e.g. 村里長) 隱藏此區塊
        
        if (isTownshipMayor) {
            html += `<div class="top-summary-grid">
                ${generateSummaryPanelHTML(candidates, metadata, "全鄉鎮")}
                ${generateCardHTML('county-main', '全鄉鎮開票結果', candidates, metadata, false, false, true, false, null, true, currentYear)} 
            </div>`;
        } else if (shouldRenderCounty) {
            html += `<div class="top-summary-grid">
                ${generateSummaryPanelHTML(candidates, metadata, "全縣")}
                ${generateCardHTML('county-main', '全縣開票結果', candidates, metadata, false, false, true, false, null, true, currentYear)} 
            </div>`;
        }

        html += `</div>`; // Close first main-section

        // 下方列表區塊邏輯：
        // 1. 如果是鄉鎮長選舉 -> 顯示該鄉鎮的「村里列表」
        // 2. 如果是其他選舉 -> 顯示「鄉鎮列表」
        
        if (isTownshipMayor) {
            // 取得第一個鄉鎮的名稱 (因為鄉鎮長選舉檔案通常是單一鄉鎮)
            const townName = appState.data.townOrder[0];
            if (townName) {
                html += `<div class="main-section">
                    <div class="section-header"><span class="section-title">各村里開票結果</span></div>
                    <div class="sub-area-grid">`;
                
                const townData = appState.data.towns[townName];
                const villageList = Object.keys(townData.villages || {});
                
                villageList.forEach(village => {
                    const vData = townData.villages[village];
                    const vCands = getSortedCandidates(vData.candidates);
                    const villageMetadata = {
                        validVotes: vData.validVotes,
                        invalidVotes: vData.invalidVotes,
                        eligibleVoters: vData.eligibleVoters
                    };
                    html += generateCardHTML(`village-${village}`, village, vCands, villageMetadata, true, `renderVillage('${townName}', '${village}', true, true)`, true, false, null, true, currentYear);
                });
                html += `</div></div>`;
            }
        } else if (shouldRenderTowns) {
            html += `<div class="main-section">
                <div class="section-header"><span class="section-title">各鄉鎮開票結果</span><span class="section-badge">點擊卡片看細節</span></div>
                <div class="sub-area-grid">`;
           appState.data.townOrder.forEach(town => {
                const townData = appState.data.towns[town];
                const townCands = getSortedCandidates(townData.candidates);
                   const townMetadata = {
                    validVotes: townData.validVotes,
                    invalidVotes: townData.invalidVotes,
                    eligibleVoters: townData.eligibleVoters
                };

                html += generateCardHTML(`town-${town}`, town, townCands, townMetadata, true, `renderTown('${town}', true, true)`, true, false, null, true, currentYear);
            });
            html += `</div></div>`;
        }

        dom.content.innerHTML = html;
        updateSortIcons();
    };

    window.renderTown = function(townName, shouldScroll = true, pushState = true) {
        const townData = appState.data.towns[townName];
        const candidates = getSortedCandidates(townData.candidates);
        const townMetadata = {
            validVotes: townData.validVotes,
            invalidVotes: townData.invalidVotes,
            eligibleVoters: townData.eligibleVoters,
            electionNameFromCSV: appState.countyMetadata.electionNameFromCSV,
            electionDateFromCSV: appState.countyMetadata.electionDateFromCSV
        };
        const currentElectionObj = availableElections.find(e => e.uiName === appState.electionName);
        const currentYear = currentElectionObj ? currentElectionObj.year : "";
        const electionType = currentElectionObj ? currentElectionObj.type : '';
        const displayLevels = getDisplayLevels(electionType, appState.data);

        const isPartyList = isPartyListElection(appState.electionName);
        
        if (!shouldScroll) {
            updateTableContent('town-main', candidates, townMetadata.validVotes, true, currentYear, isPartyList);

            const shouldRenderVillages =
                displayLevels.includes(ADMIN_LEVEL.VILLAGE) &&
                Object.keys(townData.villages || {}).length > 0;

            if (shouldRenderVillages) {
                const villageList = Object.keys(townData.villages || {});
                villageList.forEach(village => {
                    const vData = townData.villages[village];
                    const vCands = getSortedCandidates(vData.candidates);
                    updateTableContent(`village-${village}`, vCands, vData.validVotes, true, currentYear, isPartyList);
                });
            }

            updateSortIcons();
            return;
        }

        if (pushState) {
            const url = `?view=town&election=${encodeURIComponent(appState.electionName)}&town=${encodeURIComponent(townName)}`;
            const state = { view: 'town', election: appState.electionName, town: townName };
            updateUrl(state, `金門選舉資料庫 - ${appState.electionName} (${townName})`, url, pushState);
        }
        
        appState.currentLevel = 'town';
        appState.currentTown = townName;
        
        if (pushState) {
            window.scrollTo(0, 0); 
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }
        
        updateBreadcrumb();
        
        appState.chartInstances.forEach(chart => chart.destroy()); 
        appState.chartInstances = [];
        
        const villageList = Object.keys(townData.villages || {});

        let html = `<div class="main-section">
            <div class="section-header"><span class="section-title">${appState.electionName}</span></div>
            <div class="top-summary-grid">
                ${generateSummaryPanelHTML(candidates, townMetadata, townName)}
                ${generateCardHTML('town-main', `${townName}開票結果`, candidates, townMetadata, false, false, true, false, null, true, currentYear)} </div>
        </div>`;
        
        const shouldRenderVillages = displayLevels.includes(ADMIN_LEVEL.VILLAGE) && Object.keys(townData.villages || {}).length > 0; 

        if (shouldRenderVillages) {
            html += `<div class="main-section">
                <div class="section-header"><span class="section-title">各村里開票結果</span></div>
                <div class="sub-area-grid">`;
           villageList.forEach(village => {
                const vData = townData.villages[village];
                const vCands = getSortedCandidates(vData.candidates);
                   const villageMetadata = {
                    validVotes: vData.validVotes,
                    invalidVotes: vData.invalidVotes,
                    eligibleVoters: vData.eligibleVoters
                };

                html += generateCardHTML(`village-${village}`, village, vCands, villageMetadata, true, `renderVillage('${townName}', '${village}', true, true)`, true, false, null, true, currentYear);
            });
            html += `</div></div>`; 
        }

        dom.content.innerHTML = html;
        updateSortIcons();
    };

    // ================= 村里層級渲染（新增） =================
    window.renderVillage = function(townName, villageName, shouldScroll = true, pushState = true) {
        const townData = appState.data.towns[townName];
        const vData = townData && townData.villages ? townData.villages[villageName] : null;
        if (!vData) {
            dom.content.innerHTML = `<div class="loading-state" style="color:red">找不到村里資料：${villageName}</div>`;
            return;
        }

        const candidates = getSortedCandidates(vData.candidates);
        const villageMetadata = {
            validVotes: vData.validVotes,
            invalidVotes: vData.invalidVotes,
            eligibleVoters: vData.eligibleVoters,
            electionNameFromCSV: appState.countyMetadata.electionNameFromCSV,
            electionDateFromCSV: appState.countyMetadata.electionDateFromCSV
        };

        const currentElectionObj = availableElections.find(e => e.uiName === appState.electionName);
        const currentYear = currentElectionObj ? currentElectionObj.year : "";
        const isPartyList = isPartyListElection(appState.electionName);

        if (!shouldScroll) {
            updateTableContent('village-main', candidates, villageMetadata.validVotes, true, currentYear, isPartyList);
            updateSortIcons();
            return;
        }

        if (pushState) {
            const url = `?view=village&election=${encodeURIComponent(appState.electionName)}&town=${encodeURIComponent(townName)}&village=${encodeURIComponent(villageName)}`;
            const state = { view: 'village', election: appState.electionName, town: townName, village: villageName };
            updateUrl(state, `金門選舉資料庫 - ${appState.electionName} (${townName} / ${villageName})`, url, pushState);
        }

        appState.currentLevel = 'village';
        appState.currentTown = townName;
        appState.currentVillage = villageName;

        if (pushState) {
            window.scrollTo(0, 0);
        } else {
            const savedY = (history.state && history.state.scrollY) ? history.state.scrollY : 0;
            setTimeout(() => window.scrollTo(0, savedY), 0);
        }

        updateBreadcrumb();

        appState.chartInstances.forEach(chart => chart.destroy());
        appState.chartInstances = [];

        let html = `<div class="main-section">
            <div class="section-header"><span class="section-title">${appState.electionName}</span></div>
            <div class="top-summary-grid">
                ${generateSummaryPanelHTML(candidates, villageMetadata, villageName)}
                ${generateCardHTML('village-main', `${villageName}開票結果`, candidates, villageMetadata, false, false, true, false, null, true, currentYear)}
            </div>
        </div>`;

        dom.content.innerHTML = html;
        updateSortIcons();
    };


    function updateBreadcrumb() {
        const level = appState.currentLevel;
        let html = '';

        if (level === 'mainMenu') {
            dom.breadcrumb.style.display = 'none';
            dom.breadcrumbBottom.style.display = 'none';
            return;
        }

        html += `<span onclick="renderMainMenu(true)">首頁</span> / `;

        if (level === 'referendumMenu') {
             html += `<span class="active">公民投票</span>`;
        } 
        else if (level === 'legislatorMenu') {
             html += `<span class="active">立法委員</span>`;
        }
        else if (level === 'townshipMenu') {
             // 鄉鎮長 / 鄉鎮民代表：此層就是分類入口，不顯示「依鄉鎮」
             html += `<span class="active">${appState.currentTownshipType}</span>`;
        }
        else if (level === 'townshipList') {
             html += `<span onclick="renderTownshipSubMenu('${appState.currentTownshipType}', true)">${appState.currentTownshipType}</span> / `;
             html += `<span class="active">${appState.currentTownshipName}</span>`;
        }
        else if (level === 'electionList') {
            if (['全國性公民投票', '地方性公民投票'].includes(appState.currentTown)) {
                html += `<span onclick="renderReferendumSubMenu(true)">公民投票</span> / `;
                html += `<span class="active">${appState.currentTown}</span>`;
            } else if (['區域立委', '不分區立委'].includes(appState.currentTown)) {
                html += `<span onclick="renderLegislatorSubMenu(true)">立法委員</span> / `;
                html += `<span class="active">${appState.currentTown}</span>`;
            } else {
                html += `<span class="active">${appState.currentTown}</span>`;
            }
        } 
        else if (level === 'county') {
    const currentEle = availableElections.find(e => e.uiName === appState.electionName);
    const electionType = currentEle ? currentEle.type : '';

    // ✅ 鄉鎮長 / 鄉鎮民代表：此層會顯示「選舉名稱」即可（不走全縣層）
    if (electionType === '鄉鎮長' || electionType === '鄉鎮民代表') {
        const type = appState.currentTownshipType || electionType;
        const township = appState.currentTownshipName || appState.currentTown;

        html += `<span onclick="renderTownshipSubMenu('${type}', true)">${type}</span> / `;
        if (township) {
            html += `<span onclick="renderElectionListByTown('${type}', '${township}', true)">${township}</span> / `;
        }
        html += `<span class="active">${appState.electionName}</span>`;
    } else {
        if (['全國性公民投票', '地方性公民投票'].includes(electionType)) {
             html += `<span onclick="renderReferendumSubMenu(true)">公民投票</span> / `;
             html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
        } else if (['區域立委', '不分區立委'].includes(electionType)) {
             html += `<span onclick="renderLegislatorSubMenu(true)">立法委員</span> / `;
             html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
        } else {
             html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
        }
        html += `<span class="active">${appState.electionName}</span>`;
    }
} 
        else if (level === 'town') {
     const currentEle = availableElections.find(e => e.uiName === appState.electionName);
     const electionType = currentEle ? currentEle.type : '';

     // ✅ 鄉鎮長 / 鄉鎮民代表：路徑固定為「首頁 / 類型 / 鄉鎮 / 選舉名稱」
     // 這一層（town）就是該鄉鎮的總表，不再額外顯示一次鄉鎮名稱
     if (electionType === '鄉鎮長' || electionType === '鄉鎮民代表') {
         const type = appState.currentTownshipType || electionType;
         const township = appState.currentTownshipName || appState.currentTown;

         html += `<span onclick="renderTownshipSubMenu('${type}', true)">${type}</span> / `;
         if (township) {
             html += `<span onclick="renderElectionListByTown('${type}', '${township}', true)">${township}</span> / `;
         }
         html += `<span class="active">${appState.electionName}</span>`;
     } else {
         // 其他類型：維持既有路徑（公投 / 立委有上層分類）
         if (['全國性公民投票', '地方性公民投票'].includes(electionType)) {
             html += `<span onclick="renderReferendumSubMenu(true)">公民投票</span> / `;
             html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
         } else if (['區域立委', '不分區立委'].includes(electionType)) {
             html += `<span onclick="renderLegislatorSubMenu(true)">立法委員</span> / `;
             html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
         } else {
             html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
         }
         html += `<span onclick="renderCounty(true, true)">${appState.electionName}</span> / `;
         html += `<span class="active">${appState.currentTown}</span>`;
     }
}

        
        
else if (level === 'village') {
    const currentEle = availableElections.find(e => e.uiName === appState.electionName);
    const electionType = currentEle ? currentEle.type : '';

    // ✅ 鄉鎮長 / 鄉鎮民代表：麵包屑以「依鄉鎮」的導覽路徑為主
    if (electionType === '鄉鎮長' || electionType === '鄉鎮民代表') {
        // 期望：首頁 / 鄉鎮長 / 金城鎮 / 2022年金城鎮長選舉 / 東門里
        html += `<span onclick="renderTownshipSubMenu('${electionType}', true)">${electionType}</span> / `;

        if (appState.currentTownshipName) {
            html += `<span onclick="renderElectionListByTown('${electionType}', '${appState.currentTownshipName}', true)">${appState.currentTownshipName}</span> / `;
        }

        html += `<span onclick="renderCounty(true, true)">${appState.electionName}</span> / `;
        html += `<span class="active">${appState.currentVillage}</span>`;
    }
    else {
        // 其他類型：維持既有路徑（公投 / 立委有上層分類）
        if (['全國性公民投票', '地方性公民投票'].includes(electionType)) {
            html += `<span onclick="renderReferendumSubMenu(true)">公民投票</span> / `;
            html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
        } else if (['區域立委', '不分區立委'].includes(electionType)) {
            html += `<span onclick="renderLegislatorSubMenu(true)">立法委員</span> / `;
            html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
        } else {
            html += `<span onclick="renderElectionList('${electionType}', true)">${electionType}</span> / `;
        }

        html += `<span onclick="renderCounty(true, true)">${appState.electionName}</span> / `;
        html += `<span onclick="renderTown('${appState.currentTown}', true, true)">${appState.currentTown}</span> / `;
        html += `<span class="active">${appState.currentVillage}</span>`;
    }
}

dom.breadcrumb.innerHTML = html;
        dom.breadcrumb.style.display = 'block';
        dom.breadcrumbBottom.innerHTML = html;
        dom.breadcrumbBottom.style.display = 'block';
    }
    
    function generateSummaryPanelHTML(candidates, metadata, title) {
        const { validVotes, invalidVotes, eligibleVoters, electionNameFromCSV, electionDateFromCSV } = metadata;
        const totalBallots = validVotes + invalidVotes;
        const turnoutRate = eligibleVoters > 0 ? (totalBallots / eligibleVoters * 100).toFixed(2) : "0.00";
        
        let subtitleHtml = '';
        if (electionNameFromCSV) {
            subtitleHtml = `<div style="color: var(--primary); font-weight: 700; font-size: 16px; margin-bottom: 15px; text-align: left; line-height: 1.4;">${electionNameFromCSV}</div>`;
        }

        let extraRows = '';
        if (electionDateFromCSV) {
            extraRows += `<li><span>投票日期</span><span class="stat-value">${electionDateFromCSV}</span></li>`;
        }
        
        let html = `
        <div class="summary-panel">
            <h3>投票概況 (${title})</h3>
            ${subtitleHtml} <ul class="summary-list">
                ${extraRows}
                <li><span>投票率</span><span class="stat-value" style="color:#d9534f;">${turnoutRate}%</span></li>
                <li><span>有效票數</span><span class="stat-value">${validVotes.toLocaleString()} 票</span></li>
                <li><span>無效票數</span><span class="stat-value">${invalidVotes.toLocaleString()} 票</span></li>
                <li><span>選舉人數</span><span class="stat-value">${eligibleVoters.toLocaleString()} 人</span></li>
            </ul>
        </div>`; 

        return html;
    }

    /**
     * 生成卡片 HTML (通用模板)
     */
    function generateCardHTML(id, title, candidates, metadata, isClickable, onClickAction, isCompact = false, isSummary = false, localSortConfig = null, triggerAnimation = false, currentElectionYear) {
        
	const clickClass = isClickable ? 'clickable' : ''; // ✅ 保留 hover 升起＋藍框效果
	const clickAttr = ''; // ✅ 卡片本體不再可點
	const actionText = isClickable
	    ? `<span class="card-action"
  	          onclick="event.stopPropagation(); ${onClickAction}">
  	          查看詳情 ➜
  	     </span>`
 	   : '';
        const summaryClass = isSummary ? 'is-summary' : '';
        const tableSizeClass = isCompact ? '' : ' large-table';
        const { validVotes, invalidVotes, eligibleVoters, seatsCount } = metadata;
        const totalBallots = validVotes + invalidVotes;
        const turnoutRate = eligibleVoters > 0 ? (totalBallots / eligibleVoters * 100).toFixed(2) : "0.00";

        let cardStatsHTML;
        if (isSummary || isCompact) {
             cardStatsHTML = `
                <div class="card-stats" style="margin-left: 0;">
                    <span style="white-space: nowrap;">
                        有效票: ${validVotes.toLocaleString()} 票            <span style="color:var(--text-sub); margin: 0 5px;">|</span>
                        投票率: <span class="rate">${turnoutRate}%</span>
                    </span>
                </div>
            `;
        } else {
             cardStatsHTML = `
                <div class="card-stats">
                    <span style="font-size:14px;">有效票: ${validVotes.toLocaleString()} 票</span>        | 無效票: ${invalidVotes.toLocaleString()} 票        <br>
                    <span style="white-space: nowrap;">
                        選舉人數: ${eligibleVoters.toLocaleString()} 人            | 投票率: <span class="rate">${turnoutRate}%</span>
                    </span>
                </div>
            `;
        }

        const currentConfig = isSummary ? localSortConfig : appState.sortConfig;
        const { key: currentSortKey, direction: currentSortDirection } = currentConfig;

        let isPartyList = isPartyListElection(title);
        if (!isPartyList && appState.currentLevel !== 'mainMenu' && appState.currentLevel !== 'electionList') {
             isPartyList = isPartyListElection(appState.electionName);
        }

        function renderTableHeader(title, sortKey, style = '', className = '') {
           const isCurrentKey = currentSortKey === sortKey;
            const iconClass = isCurrentKey ? currentSortDirection : '';
            const iconHtml = `<span data-key="${sortKey}" class="sort-icon ${iconClass}"></span>`;
           let headerTextHtml = title;
            let finalClassName = className;

            if (sortKey === 'party') {
                headerTextHtml = `<span class="party-title-desktop">推薦政黨</span><span class="party-title-mobile">政黨</span>`;
                finalClassName = `${className} col-party`;
            } else if (sortKey === 'name' && isPartyList) {
                 headerTextHtml = `政黨`; 
            }

            const headerClass = isPartyList && sortKey === 'party' ? 'col-party hidden-party' : finalClassName;

            const sortAction = isSummary    ? `sortTableInCard('${id}', '${sortKey}')`    : `sortTable('${sortKey}')`;
           return `<th style="${style}" class="${headerClass}" onclick="event.stopPropagation(); ${sortAction}">${headerTextHtml} ${iconHtml}</th>`;
        }
        
        const tableBodyHTML = generateTableBodyHTML(candidates, validVotes, triggerAnimation, currentElectionYear, isPartyList);
        
        let footerHTML = '';
        if (seatsCount) {
             const displayStat = isNaN(Number(seatsCount)) ? seatsCount : `應選 ${seatsCount} 席`;
             footerHTML = `<div class="card-footer-info">${displayStat}</div>`;
        }
        
        return `
        <div class="card ${clickClass} ${summaryClass}" ${clickAttr} id="card-${id}">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="card-title">${title}</div>
                    ${cardStatsHTML}
                </div>
                ${actionText}
            </div>
            <div class="table-area table-responsive">
                <table class="${tableSizeClass}">
                    <thead>
                        <tr>
                            ${renderTableHeader('#', 'number', 'width:40px; text-align:center;', 'col-number')}                ${renderTableHeader('候選人', 'name', '', '')}
                            ${renderTableHeader('推薦政黨', 'party', '', 'col-party')}
                            ${renderTableHeader('得票', 'votes', 'text-align:right')}
                            ${renderTableHeader('%', 'votes', 'text-align:right; width:50px')}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableBodyHTML}
                    </tbody>
                </table>
            </div>
            ${footerHTML}
        </div>`;
    }

    // ================= 歷史記錄處理 =================
    
    function checkUrlAndRender(params, pushState = false) {

    // 優先使用 history.state（返回/前進時）
    const state = window.history.state;
    if (state && state.view) {
        params = state;
    }

    if (!params || !params.view) {
        renderMainMenu(pushState);
        return;
    }

    if (params.view === 'main') {
        renderMainMenu(pushState);
        return;
    }

    if (params.view === 'referendumMenu') {
        renderReferendumSubMenu(pushState);
        return;
    }

    if (params.view === 'legislatorMenu') {
        renderLegislatorSubMenu(pushState);
        return;
    }

    if (params.view === 'townshipMenu' && params.type) {
        renderTownshipSubMenu(params.type, pushState);
        return;
    }

    if (params.view === 'townshipList' && params.type && params.town) {
        // 可能含編碼
        const type = decodeURIComponent((params.type || '').replace(/\+/g, ' '));
        const town = decodeURIComponent((params.town || '').replace(/\+/g, ' '));
        renderElectionListByTown(type, town, pushState);
        return;
    }

    if (params.view === 'list' && params.type) {
        const type = decodeURIComponent((params.type || '').replace(/\+/g, ' '));
        renderElectionList(type, pushState);
        return;
    }

    // ========== County ==========
    if (params.view === 'county' && params.election) {
        const electionName = decodeURIComponent((params.election || '').replace(/\+/g, ' '));
        const election =
            availableElections.find(e => e.uiName === electionName) ||
            availableElections.find(e => normalizeText(e.uiName) === normalizeText(electionName));

        if (election) {
            loadData(election.file, election.uiName, pushState);
        } else {
            renderMainMenu(pushState);
        }
        return;
    }

    // ========== Town ==========
    if (params.view === 'town' && params.election && params.town) {
        const electionName = decodeURIComponent((params.election || '').replace(/\+/g, ' '));
        const townName = decodeURIComponent((params.town || '').replace(/\+/g, ' '));

        const election =
            availableElections.find(e => e.uiName === electionName) ||
            availableElections.find(e => normalizeText(e.uiName) === normalizeText(electionName));

        if (!election) {
            renderMainMenu(pushState);
            return;
        }

        const file = election.file;
        const uiName = election.uiName;

        dom.content.innerHTML = `<div class="loading-state">正在載入 ${uiName} 完整數據 (回溯到 ${townName})...</div>`;
        appState.electionName = uiName;

        fetch(file)
            .then(r => { if (!r.ok) throw new Error("檔案讀取失敗，請檢查檔案名稱與路徑。"); return r.text(); })
            .then(csvText => {
                parseCSV(csvText);
                appState.sortConfig = { key: 'number', direction: 'asc' };
                appState.chartInstances.forEach(chart => chart.destroy());
                appState.chartInstances = [];
                renderTown(townName, true, false);
            })
            .catch(error => {
                console.error("載入錯誤:", error);
                dom.content.innerHTML = `<div class="loading-state" style="color:red">讀取 ${file} 失敗: ${error.message}<br>請檢查檔案是否上傳成功。</div>`;
            });

        return;
    }

    // ========== Village（關鍵：重整不回首頁） ==========
    if (params.view === 'village' && params.election && params.town && params.village) {
        const electionName = decodeURIComponent((params.election || '').replace(/\+/g, ' '));
        const townName = decodeURIComponent((params.town || '').replace(/\+/g, ' '));
        const villageName = decodeURIComponent((params.village || '').replace(/\+/g, ' '));

        const election =
            availableElections.find(e => e.uiName === electionName) ||
            availableElections.find(e => normalizeText(e.uiName) === normalizeText(electionName));

        if (!election) {
            renderMainMenu(pushState);
            return;
        }

        const file = election.file;
        const uiName = election.uiName;

        dom.content.innerHTML = `<div class="loading-state">正在載入 ${uiName} 完整數據 (回溯到 ${townName} / ${villageName})...</div>`;
        appState.electionName = uiName;

        fetch(file)
            .then(r => { if (!r.ok) throw new Error("檔案讀取失敗，請檢查檔案名稱與路徑。"); return r.text(); })
            .then(csvText => {
                parseCSV(csvText);
                appState.sortConfig = { key: 'number', direction: 'asc' };
                appState.chartInstances.forEach(chart => chart.destroy());
                appState.chartInstances = [];
                renderVillage(townName, villageName, true, false);
            })
            .catch(error => {
                console.error("載入錯誤:", error);
                dom.content.innerHTML = `<div class="loading-state" style="color:red">讀取 ${file} 失敗: ${error.message}<br>請檢查檔案是否上傳成功。</div>`;
            });

        return;
    }

    // fallback
    renderMainMenu(pushState);
}
    
    window.onpopstate = function(event) {
        document.getElementById('candidate-modal').classList.remove('active');
        document.body.style.overflow = '';

        if (event.state) {
             checkUrlAndRender(event.state, false); 
        } else {
             checkUrlAndRender(getCurrentUrlParams(), false);
        }
    };


    // ================= 初始化 =================

    (function init() {
        dom.content.innerHTML = `<div class="loading-state">正在載入選舉數據...請稍候。</div>`;
        
        Promise.all([
            loadAllElectionSummaries(availableElections),
            loadCandidateData()
        ]).then(() => {
           const params = getCurrentUrlParams();
           if (params.view && params.view !== 'main') {
                 checkUrlAndRender(params, false);} else {
                 const state = { view: 'main' };
                 updateUrl(state, "金門選舉資料庫 - 首頁", "?view=main", false);     renderMainMenu(false);}
        });
    })();