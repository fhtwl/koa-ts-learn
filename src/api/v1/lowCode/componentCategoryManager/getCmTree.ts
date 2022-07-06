import Router from 'koa-router'
import { Success } from '../../../../core/HttpException'

const router = new Router({
  prefix: '/api/v1/lowCode/componentCategoryManager',
})

/*
 * 获取分类树形结构
 * @return
 */
router.post('/getCmTree', async () => {
  const data = [
    {
      id: 2,
      businessId: '',
      parentId: 0,
      treeType: '',
      children: [
        {
          id: 5,
          businessId: '',
          parentId: 2,
          treeType: '',
          children: [],
          name: '分类4',
          enName: '',
          describe: '',
          rootId: '',
          categoryLevel: '',
          subDataElementCount: '',
          treeObj: [
            {
              id: 140,
              name: '面积图测试',
              type: 2,
              componentType: 1,
              datasourceId: 105,
              tableName: 'zt_rk_xsb',
              databaseName: 'default',
              dataGradeThematicId: 5,
              tableCode: 'zt_rk_xsb40',
              dasChartTypeId: 13,
              chartStyle:
                '{"globeStyle":"{"data":[],"title":{"name":"分类统计","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px","textAlign":"center"}},"option":{"color":[],"xAxis":{"gridIndex":0,"show":true,"position":"bottom","type":"category","name":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameLocation":"end","nameRotate":0,"data":[],"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true,"length":14},"axisLabel":{"rotate":0,"interval":"auto"}},"tooltip":{"trigger":"axis","axisPointer":{"type":"shadow"}},"yAxis":{"show":true,"position":"top","type":"value","name":"","nameLocation":"start","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameRotate":0,"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true},"axisLabel":{"rotate":0,"interval":"auto"}},"grid":{"show":false,"left":"10%","top":60,"right":"10%","bottom":60,"width":"auto","height":"auto","containLabel":true},"dataZoom":{"show":false,"type":"slider","realtime":false,"orient":"horizontal","left":10,"right":10,"bottom":10,"top":"auto","width":"auto","height":20},"legend":{"show":false,"left":"right","right":"auto","top":"middle","bottom":"auto","width":"auto","height":"auto","orient":"horizontal","textStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12}},"series":[],"backgroundColor":"transparent"}}", "seriesStyle":"{"cgbyfkje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"rgba(49,194,184,1)","borderRadius":[0,0,0,0]},"itemStyle":{"opacity":1,"color":"rgba(194,49,146,1)","borderRadius":[0,0,0,0]}}}"}',
              chartAxisData:
                '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"cgbyfkje","enName":"cgbyfkje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"96","colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1645145434936,"pageNum":1,"pageSize":999999,"chartType":13,"type":1}',
              status: 0,
              del: 0,
              createUser: 'admin',
              createTime: '2022-02-18 16:43:59',
              updateUser: 'liang',
              updateTime: '2022-03-01 13:49:37',
              tenantId: 1,
              moduleCategoryId: '',
              multipleAnalysisId: '',
              chartName: '面积图',
              chartEnName: 'AREA_LINE_CHAR',
              chartDescription: '',
              chartTips: '面积图:',
              chartTypeId: '13',
              componentCategoryId: '5',
              componentCategoryName: '分类4',
              callCount: 0,
            },
            {
              id: 138,
              name: '折线图测试',
              type: 2,
              componentType: 1,
              datasourceId: 105,
              tableName: 'zt_rk_xsb',
              databaseName: 'default',
              dataGradeThematicId: 5,
              tableCode: 'zt_rk_xsb40',
              dasChartTypeId: 3,
              chartStyle:
                '{"globeStyle":"{"title":{"name":"明细表2","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"pagination":{"pageSize":20,"current":1,"total":533},"option":{"data":[],"fields":{"columns":[]},"meta":[]}}", "seriesStyle":""}',
              chartAxisData:
                '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[],"timeStamp":1645520509375,"pageNum":1,"dataId":138,"name":"折线图测试","pageSize":20,"chartType":3,"type":1}',
              status: 0,
              del: 0,
              createUser: 'admin',
              createTime: '2022-02-18 16:39:20',
              updateUser: 'niewanjun',
              updateTime: '2022-02-24 09:52:17',
              tenantId: 1,
              moduleCategoryId: '',
              multipleAnalysisId: '',
              chartName: '明细表',
              chartEnName: 'LIST_TABLE',
              chartDescription: '',
              chartTips: '明细表:',
              chartTypeId: '3',
              componentCategoryId: '5',
              componentCategoryName: '分类4',
              callCount: 0,
            },
            {
              id: 136,
              name: '测试条形图',
              type: 2,
              componentType: 1,
              datasourceId: 105,
              tableName: 'zt_rk_xsb',
              databaseName: 'default',
              dataGradeThematicId: 5,
              tableCode: 'zt_rk_xsb40',
              dasChartTypeId: 6,
              chartStyle:
                '{"globeStyle":"{"data":[],"title":{"name":"未命名","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"option":{"xAxis":{"gridIndex":0,"show":true,"position":"bottom","type":"value","name":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameLocation":"","axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true,"length":14}},"tooltip":{"trigger":"axis","axisPointer":{"type":"shadow"}},"yAxis":{"show":true,"position":"top","type":"category","name":"","data":[],"nameLocation":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true}},"legend":{"show":false,"left":"center","right":"auto","top":"top","bottom":"auto","width":"auto","height":"auto","orient":"horizontal","textStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12}},"series":[],"backgroundColor":"transparent"}}", "seriesStyle":"{"bycgje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"#c23531","borderRadius":[0,0,0,0]}},"cp1hk":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"#2f4554","borderRadius":[0,0,0,0]}}}"}',
              chartAxisData:
                '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"bycgje","enName":"bycgje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"95","colType":"INT","order":0,"origin":0,"type":2},{"name":"cp1hk","enName":"cp1hk","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"97","colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1645083445300,"pageNum":1,"pageSize":999999,"chartType":6,"type":1}',
              status: 0,
              del: 0,
              createUser: 'admin',
              createTime: '2022-02-18 16:37:51',
              updateUser: 'niewanjun',
              updateTime: '2022-02-21 16:27:01',
              tenantId: 1,
              moduleCategoryId: '',
              multipleAnalysisId: '',
              chartName: '条形图',
              chartEnName: 'BAR_CHART',
              chartDescription: '',
              chartTips: '条形图:',
              chartTypeId: '6',
              componentCategoryId: '5',
              componentCategoryName: '分类4',
              callCount: 0,
            },
          ],
          leaf: true,
        },
        {
          id: 6,
          businessId: '',
          parentId: 2,
          treeType: '',
          children: [],
          name: '分类5',
          enName: '',
          describe: '',
          rootId: '',
          categoryLevel: '',
          subDataElementCount: '',
          treeObj: [
            {
              id: 166,
              name: '堆叠柱状图组件',
              type: 2,
              componentType: 1,
              datasourceId: 105,
              tableName: 'zt_rk_xsb',
              databaseName: 'default',
              dataGradeThematicId: 5,
              tableCode: 'zt_rk_xsb40',
              dasChartTypeId: 5,
              chartStyle:
                '{"globeStyle":"{"data":[],"title":{"name":"未命名","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"option":{"xAxis":{"gridIndex":0,"show":true,"position":"bottom","type":"category","name":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameLocation":"end","nameRotate":0,"data":[],"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true,"length":14},"axisLabel":{"show":true,"rotate":0,"margin":8,"interval":"auto"}},"tooltip":{"trigger":"axis","axisPointer":{"type":"shadow"}},"yAxis":{"show":true,"position":"top","type":"value","name":"","nameLocation":"start","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameRotate":0,"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true},"axisLabel":{"show":true,"rotate":0,"margin":8,"interval":"auto"}},"grid":{"show":false,"left":"10%","top":60,"right":"10%","bottom":60,"width":"auto","height":"auto","containLabel":true},"dataZoom":{"show":false,"type":"slider","realtime":false,"orient":"horizontal","left":10,"right":10,"bottom":10,"top":"auto","width":"auto","height":20},"legend":{"show":false,"left":"center","right":"auto","top":"top","bottom":"auto","width":"auto","height":"auto","orient":"horizontal","textStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12}},"series":[],"backgroundColor":"transparent"}}", "seriesStyle":"{"cgbyfkje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"#c23531","borderRadius":[0,0,0,0]}},"cp1xsje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"#2f4554","borderRadius":[0,0,0,0]}}}"}',
              chartAxisData:
                '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"xsqd","enName":"xsqd","countingRules":"","id":"90","source":4,"colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"cgbyfkje","enName":"cgbyfkje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"96","source":4,"colType":"INT","order":0,"origin":0,"type":2},{"name":"cp1xsje","enName":"cp1xsje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"98","source":4,"colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1646038264664,"pageNum":1,"pageSize":999999,"chartType":5,"type":1}',
              status: 0,
              del: 0,
              createUser: 'liang',
              createTime: '2022-02-28 16:49:35',
              updateUser: '',
              updateTime: '',
              tenantId: 1,
              moduleCategoryId: '',
              multipleAnalysisId: '',
              chartName: '堆叠柱状图',
              chartEnName: 'STACKED_COLUMN_CHART',
              chartDescription: '',
              chartTips: '堆叠柱状图:',
              chartTypeId: '5',
              componentCategoryId: '6',
              componentCategoryName: '分类5',
              callCount: 0,
            },
          ],
          leaf: true,
        },
        {
          id: 12,
          businessId: '',
          parentId: 2,
          treeType: '',
          children: [],
          name: '测试分类',
          enName: '',
          describe: '',
          rootId: '',
          categoryLevel: '',
          subDataElementCount: '',
          treeObj: [
            {
              id: 151,
              name: '明细表',
              type: 2,
              componentType: 1,
              datasourceId: 105,
              tableName: 'zt_rk_test_label_index_teble',
              databaseName: 'default',
              dataGradeThematicId: 5,
              tableCode: 'zt_rk_test_label_index_teble35',
              dasChartTypeId: 3,
              chartStyle:
                '{"globeStyle":"{"title":{"name":"未命名","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"pagination":{"pageSize":20,"current":1,"total":3},"option":{"data":[],"fields":{"columns":[]},"meta":[]}}", "seriesStyle":""}',
              chartAxisData:
                '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_test_label_index_teble","tableCode":"zt_rk_test_label_index_teble35"},"dimensions":[{"name":"姓名","enName":"name","countingRules":"","id":"64","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[],"timeStamp":1645520230203,"pageNum":1,"pageSize":20,"chartType":3,"type":1}',
              status: 0,
              del: 0,
              createUser: 'niewanjun',
              createTime: '2022-02-22 16:55:39',
              updateUser: '',
              updateTime: '',
              tenantId: 1,
              moduleCategoryId: '',
              multipleAnalysisId: '',
              chartName: '明细表',
              chartEnName: 'LIST_TABLE',
              chartDescription: '',
              chartTips: '明细表:',
              chartTypeId: '3',
              componentCategoryId: '12',
              componentCategoryName: '测试分类',
              callCount: 0,
            },
          ],
          leaf: true,
        },
      ],
      name: '分类1',
      enName: '',
      describe: '',
      rootId: 2,
      categoryLevel: '',
      subDataElementCount: '',
      treeObj: [
        {
          id: 134,
          name: '新柱状图',
          type: 2,
          componentType: 1,
          datasourceId: 105,
          tableName: 'zt_rk_xsb',
          databaseName: 'default',
          dataGradeThematicId: 5,
          tableCode: 'zt_rk_xsb40',
          dasChartTypeId: 4,
          chartStyle:
            '{"globeStyle":"{"data":[],"title":{"name":"未命名","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"option":{"xAxis":{"gridIndex":0,"show":true,"position":"bottom","type":"category","name":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameLocation":"end","nameRotate":0,"data":[],"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true,"length":14},"axisLabel":{"rotate":0,"interval":"auto"}},"tooltip":{"trigger":"axis","axisPointer":{"type":"shadow"}},"yAxis":{"show":true,"position":"top","type":"value","name":"","nameLocation":"start","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameRotate":0,"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true},"axisLabel":{"rotate":0,"interval":"auto"}},"grid":{"show":false,"left":"10%","top":60,"right":"10%","bottom":60,"width":"auto","height":"auto","containLabel":true},"dataZoom":{"show":false,"type":"slider","realtime":false,"orient":"horizontal","left":10,"right":10,"bottom":10,"top":"auto","width":"auto","height":20},"legend":{"show":false,"left":"center","right":"auto","top":"top","bottom":"auto","width":"auto","height":"auto","orient":"horizontal","textStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12}},"series":[],"backgroundColor":"transparent"}}", "seriesStyle":"{"cgbyfkje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"rgba(97,117,249,1)","borderRadius":[0,0,0,0]}}}"}',
          chartAxisData:
            '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"cgbyfkje","enName":"cgbyfkje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"96","colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1645171242071,"pageNum":1,"pageSize":999999,"chartType":4,"type":1}',
          status: 0,
          del: 0,
          createUser: 'liang',
          createTime: '2022-02-18 15:59:01',
          updateUser: 'admin',
          updateTime: '2022-02-24 17:52:17',
          tenantId: 1,
          moduleCategoryId: '',
          multipleAnalysisId: '',
          chartName: '柱状图',
          chartEnName: 'HISTOGRAM',
          chartDescription: '',
          chartTips: '柱状图:',
          chartTypeId: '4',
          componentCategoryId: '2',
          componentCategoryName: '分类1',
          callCount: 0,
        },
        {
          id: 142,
          name: '测试432432',
          type: 2,
          componentType: 1,
          datasourceId: 105,
          tableName: 'zt_rk_xsb',
          databaseName: 'default',
          dataGradeThematicId: 5,
          tableCode: 'zt_rk_xsb40',
          dasChartTypeId: 4,
          chartStyle:
            '{"globeStyle":"{"data":[],"title":{"name":"未命名","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"option":{"xAxis":{"gridIndex":0,"show":true,"position":"bottom","type":"category","name":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameLocation":"","data":[],"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true,"length":14}},"tooltip":{"trigger":"axis","axisPointer":{"type":"shadow"}},"yAxis":{"show":true,"position":"top","type":"value","name":"","nameLocation":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true}},"legend":{"show":false,"left":"center","right":"auto","top":"top","bottom":"auto","width":"auto","height":"auto","orient":"horizontal","textStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12}},"series":[],"backgroundColor":"transparent"}}", "seriesStyle":"{"cp1xsje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"#c23531","borderRadius":[0,0,0,0]}},"hkje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"rgba(185,21,35,1)","borderRadius":[0,0,0,0]}}}"}',
          chartAxisData:
            '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"cp1xsje","enName":"cp1xsje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"98","colType":"INT","order":0,"origin":0,"type":2},{"name":"hkje","enName":"hkje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"102","colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1645490277264,"pageNum":1,"dataId":142,"name":"测试432432","pageSize":999999,"chartType":4,"type":1}',
          status: 0,
          del: 0,
          createUser: 'liang',
          createTime: '2022-02-18 16:51:01',
          updateUser: 'niewanjun',
          updateTime: '2022-02-22 10:29:29',
          tenantId: 1,
          moduleCategoryId: '',
          multipleAnalysisId: '',
          chartName: '柱状图',
          chartEnName: 'HISTOGRAM',
          chartDescription: '',
          chartTips: '柱状图:',
          chartTypeId: '4',
          componentCategoryId: '2',
          componentCategoryName: '分类1',
          callCount: 0,
        },
        {
          id: 139,
          name: '新折线图测试',
          type: 2,
          componentType: 1,
          datasourceId: 105,
          tableName: 'zt_rk_xsb',
          databaseName: 'default',
          dataGradeThematicId: 5,
          tableCode: 'zt_rk_xsb40',
          dasChartTypeId: 12,
          chartStyle:
            '{"globeStyle":"{"data":[],"title":{"name":"折线图","style":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":"16px"}},"option":{"color":[],"xAxis":{"gridIndex":0,"show":true,"position":"bottom","type":"category","name":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"nameLocation":"","data":[],"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true,"length":14}},"tooltip":{"trigger":"axis","axisPointer":{"type":"shadow"}},"yAxis":{"show":true,"position":"top","type":"value","name":"","nameLocation":"","nameTextStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12,"color":"#000000"},"axisLine":{"show":true},"splitLine":{"show":true},"axisTick":{"show":true}},"legend":{"show":false,"left":"center","right":"auto","top":"top","bottom":"auto","width":"auto","height":"auto","orient":"horizontal","textStyle":{"fontFamily":"system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol","fontSize":12}},"series":[],"backgroundColor":"transparent"}}", "seriesStyle":"{"cgbyfkje":{"label":{"show":true,"position":"top","rotate":0,"offset":[0,0]},"seriesItemStyle":{"opacity":1,"color":"#c23531","borderRadius":[0,0,0,0]},"itemStyle":{"opacity":1,"color":"#c23531","borderRadius":[0,0,0,0]}}}"}',
          chartAxisData:
            '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"cgbyfkje","enName":"cgbyfkje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"96","colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1645173767363,"pageNum":1,"pageSize":999999,"chartType":12,"type":1}',
          status: 0,
          del: 0,
          createUser: 'liang',
          createTime: '2022-02-18 16:41:24',
          updateUser: 'niewanjun',
          updateTime: '2022-02-22 09:35:25',
          tenantId: 1,
          moduleCategoryId: '',
          multipleAnalysisId: '',
          chartName: '折线图',
          chartEnName: 'LINE_CHAR',
          chartDescription: '',
          chartTips: '折线图:',
          chartTypeId: '12',
          componentCategoryId: '2',
          componentCategoryName: '分类1',
          callCount: 0,
        },
        {
          id: 149,
          name: '新柱状图-复制',
          type: 2,
          componentType: 1,
          datasourceId: 105,
          tableName: 'zt_rk_xsb',
          databaseName: 'default',
          dataGradeThematicId: 5,
          tableCode: 'zt_rk_xsb40',
          dasChartTypeId: 4,
          chartStyle: '{"globeStyle":"", "seriesStyle":""}',
          chartAxisData:
            '{"dataSource":{"databaseName":"default","datasourceId":105,"gradeThematicId":5,"tableName":"zt_rk_xsb","tableCode":"zt_rk_xsb40"},"dimensions":[{"name":"gszq","enName":"gszq","countingRules":"","id":"89","colType":"STRING","order":0,"origin":0,"type":1}],"globalFilter":[],"measures":[{"name":"cgbyfkje","enName":"cgbyfkje","numFormat":{"type":1,"digit":0,"unit":1,"suffix":""},"countingRules":1,"id":"96","colType":"INT","order":0,"origin":0,"type":2}],"timeStamp":1645171242071,"pageNum":1,"pageSize":999999,"chartType":4,"type":1}',
          status: 0,
          del: 0,
          createUser: 'liang',
          createTime: '2022-02-22 09:43:49',
          updateUser: '',
          updateTime: '',
          tenantId: 1,
          moduleCategoryId: '',
          multipleAnalysisId: '',
          chartName: '柱状图',
          chartEnName: 'HISTOGRAM',
          chartDescription: '',
          chartTips: '柱状图:',
          chartTypeId: '4',
          componentCategoryId: '2',
          componentCategoryName: '分类1',
          callCount: 0,
        },
      ],
      leaf: false,
    },
  ]
  throw new Success(data)
})

export default router