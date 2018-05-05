/**
 * rootReducer 
 */
import { combineReducers } from 'redux';

import signIn from './sign_in.js';
import common from './common.js';
import index from './index.js';
import main from './main.js';
import system from './system.js';
import maintenance from './maintenance.js';
import matter_repair from './matter_repair.js';
import daily from './daily.js';
import report from './report.js';
import equipment from './equipment.js';
import environmental from './environmental.js';
import patrol from './patrol.js';
import my_task from './my_task.js';
import material from './material.js';
import archives_managent from './archives_managent.js';
import headquarters from './headquarters.js';
import contract from './contract.js';
import defect_document from './defect_document.js';

export default combineReducers({
	signIn,
    common,
    index,
    main,
    system,
    maintenance,
    daily,
    report,
    equipment,
    environmental,
    patrol,
    matter_repair,
    my_task,
    material,
    archives_managent,
    headquarters,
    contract,
    defect_document
});
