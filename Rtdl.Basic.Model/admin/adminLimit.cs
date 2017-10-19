using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Basic.Model
{
    public class adminLimit
    {
        public int ID { get; set; }
        public string LimitName { get; set; }
        public string TypeName { get; set; }
        public string LimitUrl { get; set; }
        public int LimitType { get; set; }
        public int Enable { get; set; }
        public int DescNum { get; set; }
        public string Icon { get; set; }
        public int PID { get; set; }
    }
}
