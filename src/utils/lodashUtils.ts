import _ from 'lodash'

export const mergeObjects = (...objects: any[]) => {
    if (objects.length === 1) {
        objects.push(_.cloneDeep(objects[0]))
    }

    return _.mergeWith({}, ...objects, (obj: any, src: any): any => {
        if (_.isArray(obj)) {
            return _.uniqWith(obj.concat(src), _.isEqual)
        }
    })
}
