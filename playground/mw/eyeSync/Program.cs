using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace eyeSync
{
    static class Program
    {
        /// <summary>
        /// Der Haupteinstiegspunkt für die Anwendung.
        /// </summary>
        [STAThread]
        static void Main(string[] kzp)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            if (Array.IndexOf(kzp,"/mini")==-1) Application.Run(new frm_main(false));
            else Application.Run(new frm_main(true));
        }
    }
}
