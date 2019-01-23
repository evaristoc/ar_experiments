# Install script for directory: /home/ec/opencv/modules

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/install")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/calib3d/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/core/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/dnn/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/features2d/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/flann/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/gapi/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/highgui/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/imgcodecs/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/imgproc/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/java/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/js/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/ml/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/objdetect/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/photo/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/python/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/stitching/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/ts/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/video/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/videoio/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/world/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/core/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/flann/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/imgproc/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/java_bindings_generator/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/photo/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/dnn/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/features2d/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/calib3d/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/objdetect/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/video/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/js/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/python_bindings_generator/cmake_install.cmake")

endif()

