using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Rtdl.Sms.Model;
using Rtdl.Basic.Data;

namespace Rtdl.Sms.Data
{
    public class _SmsKeyWords:DbCenter
    {
        public List<string> GetKeyList()
        {
            List<string> le = null;
            string sql = "select distinct KeyWord from tbl_sms_keyword";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<string>();
                    foreach (DataRow r in dt.Rows)
                    {
                        le.Add(r["KeyWord"].ToString());
                    }
                }
            }
            return le;
        }
    }
}
