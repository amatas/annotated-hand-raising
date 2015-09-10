fluid_1_5=fluid_1_5||{},function($,fluid){"use strict";fluid.renderer||fluid.fail("fluidRenderer.js is a necessary dependency of RendererUtilities"),fluid.renderer.visitDecorators=function(that,visitor){fluid.visitComponentChildren(that,function(component,name){0===name.indexOf(fluid.renderer.decoratorComponentPrefix)&&visitor(component,name)},{flat:!0})},fluid.renderer.clearDecorators=function(that){var instantiator=fluid.getInstantiator(that);fluid.renderer.visitDecorators(that,function(component,name){instantiator.clearComponent(that,name)})},fluid.renderer.getDecoratorComponents=function(that){var togo={};return fluid.renderer.visitDecorators(that,function(component,name){togo[name]=component}),togo},fluid.renderer.modeliseOptions=function(options,defaults,baseOptions){return $.extend({},defaults,fluid.filterKeys(baseOptions,["model","applier"]),options)},fluid.renderer.reverseMerge=function(target,source,names){names=fluid.makeArray(names),fluid.each(names,function(name){void 0===target[name]&&void 0!==source[name]&&(target[name]=source[name])})},fluid.renderer.createRendererSubcomponent=function(container,selectors,options,parentThat,fossils){options=options||{};var source=options.templateSource?options.templateSource:{node:$(container)},rendererOptions=fluid.renderer.modeliseOptions(options.rendererOptions,null,parentThat);if(rendererOptions.fossils=fossils||{},rendererOptions.parentComponent=parentThat,container.jquery){var cascadeOptions={document:container[0].ownerDocument,jQuery:container.constructor};fluid.renderer.reverseMerge(rendererOptions,cascadeOptions,fluid.keys(cascadeOptions))}var that={},templates=null;return that.render=function(tree){var cutpointFn=options.cutpointGenerator||"fluid.renderer.selectorsToCutpoints";rendererOptions.cutpoints=rendererOptions.cutpoints||fluid.invokeGlobalFunction(cutpointFn,[selectors,options]);var renderTarget=$(options.renderTarget?options.renderTarget:container);templates?(fluid.clear(rendererOptions.fossils),fluid.reRender(templates,renderTarget,tree,rendererOptions)):("function"==typeof source&&(source=source()),templates=fluid.render(source,renderTarget,tree,rendererOptions))},that},fluid.defaults("fluid.commonRendererComponent",{gradeNames:[],initFunction:"fluid.initRendererComponent",mergePolicy:{"rendererOptions.idMap":"nomerge","rendererOptions.model":"preserve",protoTree:"noexpand, replace",parentBundle:"nomerge","changeApplierOptions.resolverSetConfig":"resolverSetConfig"},invokers:{refreshView:{funcName:"fluid.rendererComponent.refreshView",args:"{that}"},produceTree:{funcName:"fluid.rendererComponent.produceTree",args:"{that}"}},rendererOptions:{autoBind:!0},events:{prepareModelForRender:null,onRenderTree:null,afterRender:null},listeners:{onCreate:{funcName:"fluid.rendererComponent.renderOnInit",args:["{that}.options.renderOnInit","{that}"],priority:"last"}}}),fluid.defaults("fluid.rendererComponent",{gradeNames:["fluid.commonRendererComponent","fluid.viewComponent","autoInit"]}),fluid.defaults("fluid.rendererRelayComponent",{gradeNames:["fluid.commonRendererComponent","fluid.viewRelayComponent","autoInit"]}),fluid.rendererComponent.renderOnInit=function(renderOnInit,that){(renderOnInit||that.renderOnInit)&&that.refreshView()},fluid.protoExpanderForComponent=function(parentThat,options){var expanderOptions=fluid.renderer.modeliseOptions(options.expanderOptions,{ELstyle:"${}"},parentThat);fluid.renderer.reverseMerge(expanderOptions,options,["resolverGetConfig","resolverSetConfig"]);var expander=fluid.renderer.makeProtoExpander(expanderOptions,parentThat);return expander},fluid.rendererComponent.refreshView=function(that){if(!that.renderer)return void(that.renderOnInit=!0);fluid.renderer.clearDecorators(that),that.events.prepareModelForRender.fire(that.model,that.applier,that);var tree=that.produceTree(that),rendererFnOptions=that.renderer.rendererFnOptions;if(!rendererFnOptions.noexpand){var expander=fluid.protoExpanderForComponent(that,rendererFnOptions);tree=expander(tree)}that.events.onRenderTree.fire(that,tree),that.renderer.render(tree),that.events.afterRender.fire(that)},fluid.rendererComponent.produceTree=function(that){var produceTreeOption=that.options.produceTree;return produceTreeOption?("string"==typeof produceTreeOption?fluid.getGlobalValue(produceTreeOption):produceTreeOption)(that):that.options.protoTree},fluid.initRendererComponent=function(componentName,container,options){var that=fluid.initView(componentName,container,options,{gradeNames:["fluid.rendererComponent"]});fluid.getForComponent(that,"model"),fluid.getForComponent(that,"applier"),fluid.diagnoseFailedView(componentName,that,fluid.defaults(componentName),arguments),fluid.fetchResources(that.options.resources);var messageResolver,rendererOptions=fluid.renderer.modeliseOptions(that.options.rendererOptions,null,that);!rendererOptions.messageSource&&that.options.strings&&(messageResolver=fluid.messageResolver({messageBase:that.options.strings,resolveFunc:that.options.messageResolverFunction,parents:fluid.makeArray(that.options.parentBundle)}),rendererOptions.messageSource={type:"resolver",resolver:messageResolver}),fluid.renderer.reverseMerge(rendererOptions,that.options,["resolverGetConfig","resolverSetConfig"]),that.rendererOptions=rendererOptions;var rendererFnOptions=$.extend({},that.options.rendererFnOptions,{rendererOptions:rendererOptions,repeatingSelectors:that.options.repeatingSelectors,selectorsToIgnore:that.options.selectorsToIgnore,expanderOptions:{envAdd:{styles:that.options.styles}}});that.options.resources&&that.options.resources.template&&(rendererFnOptions.templateSource=function(){return that.options.resources.template.resourceText}),fluid.renderer.reverseMerge(rendererFnOptions,that.options,["resolverGetConfig","resolverSetConfig"]),rendererFnOptions.rendererTargetSelector&&(container=function(){return that.dom.locate(rendererFnOptions.rendererTargetSelector)});var renderer={fossils:{},rendererFnOptions:rendererFnOptions,boundPathForNode:function(node){return fluid.boundPathForNode(node,renderer.fossils)}},rendererSub=fluid.renderer.createRendererSubcomponent(container,that.options.selectors,rendererFnOptions,that,renderer.fossils);return that.renderer=$.extend(renderer,rendererSub),messageResolver&&(that.messageResolver=messageResolver),renderer.refreshView=fluid.getForComponent(that,"refreshView"),that};var removeSelectors=function(selectors,selectorsToIgnore){return fluid.each(fluid.makeArray(selectorsToIgnore),function(selectorToIgnore){delete selectors[selectorToIgnore]}),selectors},markRepeated=function(selectorKey,repeatingSelectors){return repeatingSelectors&&fluid.each(repeatingSelectors,function(repeatingSelector){selectorKey===repeatingSelector&&(selectorKey+=":")}),selectorKey};fluid.renderer.selectorsToCutpoints=function(selectors,options){var togo=[];options=options||{},selectors=fluid.copy(selectors),options.selectorsToIgnore&&(selectors=removeSelectors(selectors,options.selectorsToIgnore));for(var selectorKey in selectors)togo.push({id:markRepeated(selectorKey,options.repeatingSelectors),selector:selectors[selectorKey]});return togo},fluid.renderer.NO_COMPONENT={},fluid.renderer.mergeComponents=function(target,source){for(var key in source)target[key]=source[key];return target},fluid.registerNamespace("fluid.renderer.selection"),fluid.renderer.selection.inputs=function(options,container,key,config){fluid.expect("Selection to inputs expander",["selectID","inputID","labelID","rowID"],options);var selection=config.expander(options.tree),rows=fluid.transform(selection.optionlist.value,function(option,index){var togo={},element={parentRelativeID:"..::"+options.selectID,choiceindex:index};return togo[options.inputID]=element,togo[options.labelID]=fluid.copy(element),togo}),togo={};return togo[options.selectID]=selection,togo[options.rowID]={children:rows},togo=config.expander(togo)},fluid.renderer.repeat=function(options,container,key,config){fluid.expect("Repetition expander",["controlledBy","tree"],options);var env=config.threadLocal(),path=fluid.extractContextualPath(options.controlledBy,{ELstyle:"ALL"},env),list=fluid.get(config.model,path,config.resolverGetConfig),togo={};if(!list||0===list.length)return options.ifEmpty?config.expander(options.ifEmpty):togo;var expanded=[];fluid.each(list,function(element,i){var EL=fluid.model.composePath(path,i),envAdd={};options.pathAs&&(envAdd[options.pathAs]="${"+EL+"}"),options.valueAs&&(envAdd[options.valueAs]=fluid.get(config.model,EL,config.resolverGetConfig));var expandrow=fluid.withEnvironment(envAdd,function(){return config.expander(options.tree)},env);fluid.isArrayable(expandrow)?expandrow.length>0&&expanded.push({children:expandrow}):expandrow!==fluid.renderer.NO_COMPONENT&&expanded.push(expandrow)});var repeatID=options.repeatID;return-1===repeatID.indexOf(":")&&(repeatID+=":"),fluid.each(expanded,function(entry){entry.ID=repeatID}),expanded},fluid.renderer.condition=function(options,container,key,config){fluid.expect("Selection to condition expander",["condition"],options);var condition;if(options.condition.funcName){var args=config.expandLight(options.condition.args);condition=fluid.invoke(options.condition.funcName,args)}else condition=options.condition.expander?config.expander(options.condition):config.expandLight(options.condition);var tree=condition?options.trueTree:options.falseTree;return tree||(tree=fluid.renderer.NO_COMPONENT),config.expander(tree)},fluid.extractContextualPath=function(string,options,env,externalFetcher){var parsed=fluid.extractELWithContext(string,options);return parsed?parsed.context?env[parsed.context]?fluid.transformContextPath(parsed,env).path:{value:externalFetcher(parsed)}:parsed.path:void 0},fluid.transformContextPath=function(parsed,env){if(parsed.context){var EL,fetched=env[parsed.context];if("string"==typeof fetched&&(EL=fluid.extractEL(fetched,{ELstyle:"${}"})),EL)return{noDereference:""===parsed.path,path:fluid.model.composePath(EL,parsed.path)}}return parsed},fluid.renderer.makeExternalFetcher=function(contextThat){return function(parsed){var foundComponent=fluid.resolveContext(parsed.context,contextThat);return foundComponent?fluid.getForComponent(foundComponent,parsed.path):void 0}},fluid.renderer.makeProtoExpander=function(expandOptions,parentThat){function fetchEL(string){var env=threadLocal();return fluid.extractContextualPath(string,options,env,options.externalFetcher)}function detectBareBound(entry){return fluid.find(entry,function(value,key){return"decorators"===key})!==!1}var options=$.extend({ELstyle:"${}"},expandOptions);parentThat&&(options.externalFetcher=fluid.renderer.makeExternalFetcher(parentThat));var threadLocal,IDescape=options.IDescape||"\\",expandLight=function(source){return fluid.expand(source,options)},expandBound=function(value,concrete){if(void 0!==value.messagekey)return{componentType:"UIMessage",messagekey:expandBound(value.messagekey),args:expandLight(value.args)};var proto;fluid.isPrimitive(value)||fluid.isArrayable(value)?proto={}:(proto=$.extend({},value),proto.decorators&&(proto.decorators=expandLight(proto.decorators)),value=proto.value,delete proto.value);var EL;if("string"==typeof value){var fetched=fetchEL(value);EL="string"==typeof fetched?fetched:null,value=fluid.get(fetched,"value")||value}return EL?proto.valuebinding=EL:void 0!==value&&(proto.value=value),options.model&&proto.valuebinding&&void 0===proto.value&&(proto.value=fluid.get(options.model,proto.valuebinding,options.resolverGetConfig)),concrete&&(proto.componentType="UIBound"),proto};options.filter=fluid.expander.lightFilter;var expandCond,expandLeafOrCond,expandEntry=function(entry){var comp=[];return expandCond(entry,comp),{children:comp}},expandExternal=function(entry){if(entry===fluid.renderer.NO_COMPONENT)return entry;var singleTarget,target=[],pusher=function(comp){singleTarget=comp};return expandLeafOrCond(entry,target,pusher),singleTarget||target},expandConfig={model:options.model,resolverGetConfig:options.resolverGetConfig,resolverSetConfig:options.resolverSetConfig,expander:expandExternal,expandLight:expandLight},expandLeaf=function(leaf,componentType){var togo={componentType:componentType},map=fluid.renderer.boundMap[componentType]||{};for(var key in leaf)togo[key]=/decorators|args/.test(key)?expandLight(leaf[key]):map[key]?expandBound(leaf[key]):leaf[key];return togo},expandChildren=function(entry,pusher){for(var children=entry.children,i=0;i<children.length;++i){var target=[],comp={children:target},child=children[i],childPusher=function(comp){target[target.length]=comp};expandLeafOrCond(child,target,childPusher),1!==comp.children.length||comp.children[0].ID||(comp=comp.children[0]),pusher(comp)}};return expandLeafOrCond=function(entry,target,pusher){var componentType=fluid.renderer.inferComponentType(entry);componentType||!fluid.isPrimitive(entry)&&!detectBareBound(entry)||(componentType="UIBound"),componentType?pusher("UIBound"===componentType?expandBound(entry,!0):expandLeaf(entry,componentType)):(target||fluid.fail("Illegal cond->cond transition"),expandCond(entry,target))},expandCond=function(proto,target){var expandToTarget=function(expander){var expanded=fluid.invokeGlobalFunction(expander.type,[expander,proto,key,expandConfig]);expanded!==fluid.renderer.NO_COMPONENT&&fluid.each(expanded,function(el){target[target.length]=el})},condPusher=function(comp){comp.ID=key,target[target.length]=comp};for(var key in proto){var entry=proto[key];if(key.charAt(0)===IDescape&&(key=key.substring(1)),"expander"===key){var expanders=fluid.makeArray(entry);fluid.each(expanders,expandToTarget)}else entry&&(entry.children?(-1===key.indexOf(":")&&(key+=":"),expandChildren(entry,condPusher)):fluid.renderer.isBoundPrimitive(entry)?condPusher(expandBound(entry,!0)):expandLeafOrCond(entry,null,condPusher))}},function(entry){return threadLocal=fluid.threadLocal(function(){return $.extend({},options.envAdd)}),options.fetcher=fluid.makeEnvironmentFetcher(options.model,fluid.transformContextPath,threadLocal,options.externalFetcher),expandConfig.threadLocal=threadLocal,expandEntry(entry)}}}(jQuery,fluid_1_5);