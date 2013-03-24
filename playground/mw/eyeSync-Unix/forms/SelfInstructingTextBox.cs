using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;
using System.Drawing;

namespace eyeSync
{
    class SelfInstructingTextBox : TextBox
    {
        private string instructionText;

        public string InstructionText
        {
            get { return instructionText; }
            set { instructionText = value;}
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
        }

        protected override void OnGotFocus(EventArgs e)
        {
             base.OnGotFocus(e);
        }

        protected override void OnLostFocus(EventArgs e)
        {
            base.OnLostFocus(e);
        }
    }
}
