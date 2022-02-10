export const NOTIFICATION_TYPE={
    vendor_registered:'Vendor Registered',
    mobilizer_registered:'Mobilizer Registered'
}

export const ICONS = (notificationType)=>{

    switch(notificationType){
        case NOTIFICATION_TYPE.vendor_registered:
            return{
                iconBg:'danger',
                iconClass:"ti-user"
            }
            case NOTIFICATION_TYPE.mobilizer_registered:
                return{
                    iconBg:'secondary',
                    iconClass:"ti-user"
                }

            default:
                return{
                iconBg:'warning',
                iconClass:"ti-user"
                }
    }
   
}