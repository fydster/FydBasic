using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rtdl.Basic.Model
{
    public class AddressInfo
    {
        public int ID { get; set; }
        public int AdminID { get; set; }
        public int ClassID { get; set; }
        public string Contact { get; set; }
        public string Mobile { get; set; }
        public string Memo { get; set; }
        public DateTime AddOn { get; set; }
        public int Enable { get; set; }
        public string ClassName { get; set; }
    }
}
