using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Basic.Model
{
    public class adminLog
    {
        public int ID { get; set; }
        public int AdminID { get; set; }
        public string Content { get; set; }
        public string StreamNo { get; set; }
        public int LogType { get; set; }
        public DateTime AddOn { get; set; }
    }
}
