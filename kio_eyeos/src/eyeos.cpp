#include "eyeos.h"

#include <QtCore/QDir>
#include <QCoreApplication>
#include <kdebug.h>
#include <kglobal.h>
#include <klocale.h>
#include <kcomponentdata.h>
#include <kio/ioslave_defaults.h>
#include <kio/slaveconfig.h>
#include <kurl.h>
#include <kde_file.h>
#include <kconfiggroup.h>
#include <kxmlrpcclient/client.h>
using namespace KIO;
namespace KIO {
    enum buffersizes
    {
//         maximumIpcSize = 32 * 1024,
//         initialIpcSize =  2 * 1024,
//         mimimumMimeSize =     1024
    };

    // JPF: this helper was derived from write_all in file.cc (FileProtocol).
    static // JPF: in ftp.cc we make it static
    /**
     * This helper handles some special issues (blocking and interrupted
     * system call) when writing to a file handle.
     *
     * @return 0 on success or an error code on failure (ERR_COULD_NOT_WRITE,
     * ERR_DISK_FULL, ERR_CONNECTION_BROKEN).
     */
   int WriteToFile(int fd, const char *buf, size_t len)
   {
      while (len > 0)
      {  // JPF: shouldn't there be a KDE_write?
//          ssize_t written = write(fd, buf, len);
//          if (written >= 0)
//          {   buf += written;
//              len -= written;
//              continue;
//          }
//          switch(errno)
//          {   case EINTR:   continue;
//              case EPIPE:   return ERR_CONNECTION_BROKEN;
//              case ENOSPC:  return ERR_DISK_FULL;
//              default:      return ERR_COULD_NOT_WRITE;
//          }
      }
      return 0;
   }
}


extern "C"
{
	int KDE_EXPORT kdemain( int argc, char **argv )
	{
		QCoreApplication *a = new QCoreApplication(argc,argv );
		KComponentData componentData( "kio_eyeos", "kdelibs4" );
		( void ) KGlobal::locale();

		kDebug(7102) << "Starting " << getpid();

		if (argc != 4)
		{
			fprintf(stderr, "Usage: kio_eyeos protocol domain-socket1 domain-socket2\n");
			exit(-1);
		}

		Eyeos slave(argv[2], argv[3]);
		slave.dispatchLoop();

		kDebug(7102) << "Done";
		return 0;
	}
}

// --------------------------------- constructor and destructor
Eyeos::Eyeos( const QByteArray &pool, const QByteArray &app )
    : SlaveBase( "eyeos", pool, app )
{
	kDebug(7102) << "init";
}


Eyeos::~Eyeos()
{
	kDebug(7102) << "end";
}

void Eyeos::setPort(int port){
	if(!port){
		kDebug(7102) << "Setting default Port; \n" << 80;
		m_port = 80;
	}else{
		kDebug(7102) << "Setting custom Port: \n" << port;
		m_port = port;
	}
}
void Eyeos::getData( const QList<QVariant> &result, const QVariant &id )
{
		kDebug(7102) << "AAAAAAAAAAAAAAAAAAAAAAA";
}
void Eyeos::getError(int number, const QString &errorString, const QVariant &id)
{
		kDebug(7102) << "BBBBBBBBBBBBBBBBBBBBB";
}
void Eyeos::setHost( const QString& _host, quint16 _port, const QString& _user,
                   const QString& _pass )
{
	//if the host is empty, we can continue... so we must die.
	if(_host.isEmpty())
	{
		return;
	}

 	m_host = _host;
 	m_port = _port;
 	m_user = _user;
 	m_pass = _pass;
//   	eyeosLogin();
 	KXmlRpc::Client *c = new KXmlRpc::Client(KUrl("http://localhost/~nasete/production/"),this);
	kDebug(7102) << "Url resource: " << c->url();
 	QStringList list;
 	list << "root" << "root";
 	kDebug(7102) << "BEfore try";
	
	try{
		kDebug(7102) << "Inside try";
		c->call("service.um.getCurrentUserDir",
			"aaa",
			this,
			SLOT( getData( const QList<QVariant>&, const QVariant& )),
			this,
			SLOT( getError(int,const QString&, const QVariant& ))
		);
	}catch(...){
		kDebug(7102) << "Error getting the currentUser dir";
	}
}

void Eyeos::eyeosLogin()
{

	QString user = m_user;
	QString pass = m_pass;

	if ( config()->readEntry("EnableAutoLogin", false) )
	{
		QString au = config()->readEntry("autoLoginUser");
		if ( !au.isEmpty() )
		{
			user = au;
			pass = config()->readEntry("autoLoginPass");
		}
	}
//
//
	AuthInfo info;
	info.url.setProtocol( "eyeos" );
	info.url.setHost( m_host );

	if ( m_port > 0 && m_port != 80 )
		info.url.setPort( m_port );

	info.url.setUser( user );

	QByteArray tempbuf;
	int failedAuth = 0;
//
	do
	{
		if ( failedAuth > 0 || (!user.isEmpty() && pass.isEmpty()) )
		{
			QString errorMsg;
			kDebug(7102) << "Prompting user for login info...";


				if( failedAuth > 0 )
				{
					errorMsg = i18n("Message sent:\nLogin using username=%1 and "
					"password=[hidden]\n\n"
					, user);
				}

				info.username = user;

				info.prompt = i18n("You need to supply a username and a password "
				"to access this site.");
				info.commentLabel = i18n( "Site:" );
				info.comment = i18n("<b>%1</b>",  m_host );
				info.keepPassword = true;
				info.readOnly = (!m_user.isEmpty());

				bool disablePassDlg = config()->readEntry( "DisablePassDlg", false );
				if ( disablePassDlg || !openPasswordDialog( info, errorMsg ) )
				{
					error( ERR_USER_CANCELED, m_host );
					return;
				}
				else
				{
					user = info.username;
					pass = info.password;
					//we should check this pass in a near future... TODO
					m_user = user;
					m_pass = pass;
					failedAuth = -1;
					cacheAuthentication( info );
				}
		}

	}
	while( ++failedAuth );
//
//
}
//a
void Eyeos::listDir( const KUrl &url )
{
	kDebug(7102) << "listDir _._.  " << url;
	finished();
}

bool Eyeos::eyeosIsDir(const QString &path) {

}

void Eyeos::eyeosCreateUDSEntry( const QString & filename, EyeosEntry& eyeEnt, UDSEntry& entry, bool isDir )
{

}


void Eyeos::mkdir( const KUrl & url, int permissions ) {

}

void Eyeos::rename( const KUrl & src, const KUrl & dst, KIO::JobFlags flags )
{

}
//
void Eyeos::del( const KUrl & url, bool isfile )
{

}

void Eyeos::stat( const KUrl &url )
{

}

void Eyeos::get( const KUrl& url )
{

}

void Eyeos::put( const KUrl& url, int permissions, KIO::JobFlags flags )
{

}

void Eyeos::slave_status() {

}

void Eyeos::copy( const KUrl &src, const KUrl &dest, int permissions, KIO::JobFlags flags )
{

}

