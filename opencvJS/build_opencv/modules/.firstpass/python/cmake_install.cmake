# Install script for directory: /home/ec/opencv/modules/python

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
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/python/bindings/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/python/python2/cmake_install.cmake")
  include("/home/ec/Documents/MainComp_Programming/FreeCodeCamp/basejumps/ar_experiments/opencvJS/build_opencv/modules/.firstpass/python/python3/cmake_install.cmake")

endif()

