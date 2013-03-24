project(kioslave-eyeos)
find_package(KDE4 REQUIRED)
include (KDE4Defaults)
# include (MacroLibrary)
# include(MacroOptionalAddSubdirectory)
# include_directories(${CMAKE_SOURCE_DIR} ${CMAKE_BINARY_DIR} ${KDE4_INCLUDES})
include_directories(${KDE4_INCLUDES} ${KDE4_KIO_INCLUDES} ${KDEPIMLIBS_INCLUDE_DIR})

# include_directories()


########### next target ###############

set(kio_eyeos_PART_SRCS
eyeos.cpp
)


kde4_add_plugin(kio_eyeos ${kio_eyeos_PART_SRCS})
target_link_libraries(kio_eyeos kxmlrpcclient ${KDE4_KDECORE_LIBS} ${KDE4_KIO_LIBS} ${KDEPIMLIBS_INCLUDE_DIR})

install(TARGETS kio_eyeos  DESTINATION ${PLUGIN_INSTALL_DIR} )

########### install files ###############

install( FILES eyeos.protocol  DESTINATION  ${SERVICES_INSTALL_DIR} )
