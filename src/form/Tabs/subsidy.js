// 搬迁、安置、补助
import React, { useEffect } from "react";

import eventbus from '../api/eventBus'

const PropertyRight = () => {

   useEffect( () => {
      eventbus.on('richmanType', (obj) => {
         console.log('被征收人类型', obj)
      })
      eventbus.on('zz_areaTotal', (obj) => {
         console.log('证载和合法面积总计', obj)
      })
      eventbus.emit('resetSubsidy', {})
   },[])

   return (
      <>
         搬迁、安置、补助
      </>
   )
}

export default PropertyRight
