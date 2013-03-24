#ifndef KDELIBS_EYEOS_H
#define KDELIBS_EYEOS_H

#include <kurl.h>
#include <kio/slavebase.h>

struct EyeosEntry
{
	QString name;
	mode_t type;
};

//===============================================================================
// Eyeos
//===============================================================================
class Eyeos : public QObject, public KIO::SlaveBase
{
 	Q_OBJECT
	public:
		Eyeos( const QByteArray &pool, const QByteArray &app );//
		virtual ~Eyeos(); //

		virtual void setHost( const QString& host, quint16 port, const QString& user, const QString& pass ); //

		virtual void listDir( const KUrl & url ); //
		virtual void mkdir( const KUrl & url, int permissions );
		virtual void rename( const KUrl & src, const KUrl & dst, KIO::JobFlags flags );
		virtual void del( const KUrl & url, bool isfile );
		virtual void stat( const KUrl &url );

		virtual void get( const KUrl& url );
		virtual void put( const KUrl& url, int permissions, KIO::JobFlags flags );

		virtual void slave_status();

		virtual void copy( const KUrl &src, const KUrl &dest, int permissions, KIO::JobFlags flags );

		void eyeosCreateUDSEntry( const QString & filename, EyeosEntry& eyeEnt, KIO::UDSEntry& entry, bool isDir );
		void eyeosLogin();
	public slots:
		virtual void getData( const QList<QVariant> &result, const QVariant &id );
		virtual void getError( int number, const QString &errorString, const QVariant &id );
	
private:
	QString m_host;
	int m_port;
	QString m_user;
	QString m_pass;
	QString remoteHome;
	QString serverUrl;

	bool eyeosIsDir(const QString &path);
	void setPort(int port);
};

#endif // KDELIBS_EYEOS_H
