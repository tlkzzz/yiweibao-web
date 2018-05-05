/** 
 * @Description  全局常量
 */
export const pubTopic = {
    //系统管理的主题常量
    system: {
        IP_DETAIL: 'IP_DETAIL',
        IP_LIST_REFRESH: 'IP_LIST_REFRESH',
    },
    //我的任务的主题
    task:{
        BACKLOG_QUERY_KEYWORD:'BACKLOG_QUERY_KEYWORD',
        HANDLE_QUERY_KEYWORD:'HANDLE_QUERY_KEYWORD',
        HANDILING_TASK:{//经办
            ALL:"HANDILING_TASK_ALL",
            PATROLORDER:"HANDILING_TASK_PATROLORDER",
            WORKODER:"HANDILING_TASK_WORKODER",
            DAILYTASK:"HANDILING_TASK_DAILYTASK",
            DISPACHORDER:"HANDILING_TASK_DISPACHORDER",
            REPAIRORDER:"HANDILING_TASK_REPAIRORDER",
        },
        TO_TASK:{//待办
            ALL:"TO_TASK_ALL",
            PATROLORDER:"TO_TASK_PATROLORDER",
            WORKODER:"TO_TASK_WORKODER",
            DAILYTASK:"TO_TASK_DAILYTASK",
            DISPACHORDER:"TO_TASK_DISPACHORDER",
            REPAIRORDER:"TO_TASK_REPAIRORDER",
            BATCH_ASSIGNMENT_BUTTON:"BATCH_ASSIGNMENT_BUTTON",//批量派工Button展示数据
            BATCH_ASSIGNMENT:"BATCH_ASSIGNMENT",//批量派工
            MYTASK_REFRESH:"MYTASK_REFRESH"//刷新标志
        },
    },
    //报修工单
    matterrepair: {
        MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK: 'MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK',   //报修工单-流程提交-表单校验回调
        MATTER_REPAIR_SEND_PROCESS_PASS_CALLBACK: 'MATTER_REPAIR_SEND_PROCESS_PASS_CALLBACK',   //报修工单-流程提交成功回调
        MATTER_REPAIR_SAVE_FORM_VALIDATE_CALLBACK: 'MATTER_REPAIR_SAVE_FORM_VALIDATE_CALLBACK',   //报修工单-表单保存-表单校验回调
        MATTER_REPAIR_DETALL: 'MATTER_REPAIR_DETALL'
    },
    //派工工单
    dispatchorder:{
        DISPATCH_ORDER:'DISPATCH_ORDER',
        BISPATCH_DISPATCH:'BISPATCH_DISPATCH'
    },
    //总部计划
    headquartersPlan:{
        DISPATCHORDER:'DISPATCH_ORDER',//派工单
        ROUTINE_WORK:'ROUTINE_WORK'//例行工作
    }
};
