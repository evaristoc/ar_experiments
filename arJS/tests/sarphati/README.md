# About Sarphati ARJS project

This is a practice and an exploration to develop a readable reusable template for further use in other projects. Although under ARJS directory, the idea is to develop one single template script for other purposes related to graphics and ar.

### Architecture so far

* In order to avoid compatibility issues and not to add complexity the project is currently written in plain ES5.
* The last project summarising the whole exploration so far are `sarphati` files. It is focused on ARJS.
* I tried to separate modules for different purposes, in a hierarchical fashion:
	 1. HTMLSETUP module pattern that takes care of the general canvas and video settings; this initiates the APP; here I would manage all functionality directly related to the HTML view
		  * the section ARJS doesnt include video settings because ARJS does it through `arToolkitSource` method.
	 2. APP is a module pattern and it is the section where the general `scene` and what happens in the scene is controlled; here I would look for the meshes and shapes and I will manage the progress of the animation
		  * inside APP different subscenes can be setup (`sceneelements` objects in the form of handlers); these subscenes also contains the **update functions** (draw, tick, etc)
	 3. OBJECTS are "classes" of objects; they are static and add methods for animating the object, not the scene
		  * setup currently based on 2 different formats inspired by two different authors: Rainer and Biedermann. Rainer is typical JS-OO with module pattern while Biedermann is based on handlers. Although Biederman code looks more elegant, I will choose Rainer style as I found it a bit more flexible.

### Issues

* Because HTMLSETUP and APP are separated modules and scenes are based on objects (handlers), some difficulties to comunicate from top to bottom can emerge unless we use global variables. The reason is the way JS runs: it will run the global function and fail to associate `this` to the actual target, `subscenes`, when called from outside in the hierarchy even after binding. The function associations were already read and binding doesnt overwrite it. One way to solve this is to declare global HTML-related functions right inside the subscene (window.xxx) so it finds the correctly declared arguments at the time the function is read; however that would break with the current desired architecture of the project. I found that in order to keep the handling of the html functionality in the HTMLSETUP module while connecting with children functions inside nested modules can be solved by using **event emitters**. I made a simple one (translated from ES6 to ES5) for this project, based on a reference I found on Medium.
* The current setup of the project is mainly synchronous. However there are cases where some async is required, eg. for loading texture data for 3D objects. Because the synchronous format of the subscenes, methods calling shapes run *before* some async code in the shape classes is completed. For specific cases as that one I found that a solution is to pass a wrapper that is ready to wait for the completion of the promises/callbacks and then pass the final product to the scenes. That means that shape classes requiring an async functionality should accept that wrapper as argument. My intention has been to avoiding arguments for the classes but I haven't found a better solution so far. I foresee more issues with asynchronous behaviours with this project as it is.
 
