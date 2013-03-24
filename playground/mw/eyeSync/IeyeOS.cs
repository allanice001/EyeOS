using System;
using System.Collections.Generic;
using System.Text;
using eyeSync.XmlRpc;

namespace eyeSync
{
    /// <summary>
    /// Interface for the xmlrpc-library
    /// </summary>
    [XmlRpcUrl("")]
    public interface IeyeOS : IXmlRpcProxy
    {
        /// <summary>
        /// Method to get the Current user dir (eg. ./users/rt4/root)
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A cleared array</param>
        /// <returns>The current user dir</returns>
        [XmlRpcMethod("service.um.getCurrentUserDir")]
        string service_um_getCurrentUserDir(string username, string password, Array a);
        /// <summary>
        /// Method to get all files and folders of a dir
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the dir, whose Content you want to get</param>
        /// <returns>All files and folders in the dir</returns>
        [XmlRpcMethod("service.vfs.getDirContent")]
        string[] service_vfs_getDirContent(string username, string password, Array a);

        /// <summary>
        /// Method to get the information if a path is set to a file or not
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the path, you want to analyse</param>
        /// <returns>If it's a file returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.isdir")]
        bool service_vfs_isDir(string username, string password, Array a);

        /// <summary>
        /// Method to add some bytes to a file
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the filepath and the content you want to add to it</param>
        /// <returns>If everything is ok returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.appendToFileBinary")]
        bool service_vfs_appendToFileBinary(string username, string password, Array a);

        /// <summary>
        /// Method to create a new file
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the filepath</param>
        /// <returns>If everything is ok returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.create")]
        bool service_vfs_create(string username, string password, Array a);

        /// <summary>
        /// Method to create a new dir
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the path</param>
        /// <returns>If everything is ok returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.mkdir")]
        bool service_vfs_mkdir(string username, string password, Array a);

        /// <summary>
        /// Method to clear a file (deletes the content)
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the filepath</param>
        /// <returns>If everything is ok returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.erase")]
        bool service_vfs_erase(string username, string password, Array a);

        /// <summary>
        /// Method to rename a file
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the filepath</param>
        /// <returns>If everything is ok returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.rename")]
        bool service_vfs_rename(string username, string password, Array a);

        /// <summary>
        /// Method to get out, if a file exists or not
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the filepath</param>
        /// <returns>If the file exists returns true, otherwise false</returns>
        [XmlRpcMethod("service.vfs.fileExists")]
        bool service_vfs_fileExists(string username, string password, Array a);

        /// <summary>
        /// Method to read the content of a file
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="password">The password of the user above</param>
        /// <param name="a">A array containing the filepath</param>
        /// <returns>The content of the file</returns>
        [XmlRpcMethod("service.vfs.readFile")]
        string service_vfs_readFile(string username, string password, Array a);

    }
}
