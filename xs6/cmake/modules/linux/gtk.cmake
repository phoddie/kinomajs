#
#      Copyright (C) 2010-2015 Marvell International Ltd.
#      Copyright (C) 2002-2010 Kinoma, Inc.
# 
#      Licensed under the Apache License, Version 2.0 (the "License");
#      you may not use this file except in compliance with the License.
#      You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
# 
#      Unless required by applicable law or agreed to in writing, software
#      distributed under the License is distributed on an "AS IS" BASIS,
#      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#      See the License for the specific language governing permissions and
#      limitations under the License.
#
FIND_PACKAGE(PkgConfig REQUIRED)
PKG_CHECK_MODULES(GTK3 REQUIRED gtk+-3.0)
PKG_CHECK_MODULES(GLIB2 REQUIRED glib-2.0)

INCLUDE_DIRECTORIES(${GTK3_INCLUDE_DIRS})
LINK_DIRECTORIES(${GTK3_LIBRARY_DIRS})

INCLUDE_DIRECTORIES(${GLIB2_INCLUDE_DIRS})
LINK_DIRECTORIES(${GLIB2_LIBRARY_DIRS})

LIST(APPEND LIBRARIES ${GTK3_LIBRARIES} ${GLIB2_LIBRARIES})

# vim: ft=cmake