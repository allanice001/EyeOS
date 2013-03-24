using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace eyeSync
{
    public partial class miniNotice : Form
    {
        public miniNotice()
        {
            InitializeComponent();
            Show();
            Left = Screen.PrimaryScreen.WorkingArea.Width - Width;
            Top = Screen.PrimaryScreen.WorkingArea.Height - Height;
            Visible = false;
        }

        public string Notice
        {
            get { return label1.Text; }
            set { label1.Text = value; }
        }
    }
}
