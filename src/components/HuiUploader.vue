<template>
  <section class="HuiUploader">
    <transition name="fade">
      <div class="weui-gallery" ref="gallery" v-show="galleryIsVisible" @click.prevent="closeGallery">
        <span class="weui-gallery__img" ref="galleryImg"></span>
        <div class="weui-gallery__opr">
          <a href="javascript:" class="weui-gallery__del">
            <i class="hui-icon-bell weui-icon_gallery-delete extend-click" @click.prevent="delOneImage"></i>
          </a>
        </div>
      </div>
    </transition>

    <div class="weui-uploader">
      <div class="weui-uploader__hd">
        <p class="weui-uploader__title">
          <span>图片上传</span>
          <span class="countLimitHint">（{{uploadedCount}}/{{maxCount}}）</span>
        </p>
      </div>
      <div class="weui-uploader__bd">
        <ul class="weui-uploader__files" ref="uploaderFiles">
          <li
            class="weui-uploader__file"
            :style="getImage(src)"
            v-for="(src, index) in srcs"
            :key="index"
            @click="previewBigImage(index, $event)">
          </li>
        </ul>
        <div class="weui-uploader__input-box">
          <input ref="uploaderInput" class="weui-uploader__input" type="file" accept="image/*">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {createObjectURL, compress, dataURLtoFile} from 'hui/lib/util.js'
export default {
  name: 'HuiUploader',
  props: {
    maxSize: {
      type: Number,
      default: 500 * 1024
    },
    maxCount: {
      type: Number,
      default: 5
    },
    outputWidth: {
      type: Number,
      default: 1024
    }
  },
  data () {
    return {
      uploadedCount: 0, // 已上传数
      outputFiles: [], // 输出图片文件
      srcs: [], // 已上传图片base64
      galleryIsVisible: false, // 预览层
      currentPreviewIndex: -1 // 当前预览图片索引
    }
  },
  methods: {
    closeGallery () {
      this.galleryIsVisible = false
    },
    delOneImage () {
      this.srcs.splice(this.currentPreviewIndex, 1)
      this.outputFiles.splice(this.currentPreviewIndex, 1)
      this.galleryIsVisible = false
      this.uploadedCount -= 1
    },
    previewBigImage (index, event) {
      this.currentPreviewIndex = index
      let bg = event.target.getAttribute('style')
      this.$refs.galleryImg.setAttribute('style', bg)
      this.galleryIsVisible = true
    },
    getImage (src) {
      return {
        'background-image': `url(${src})`
      }
    },
    readAsDataURL (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise((resolve, reject, c) => {
        reader.onerror = () => {
          reject(reader.error.code)
        }
        // reader.onprogress = (event) => {
        //   if (event.lengthComputable) {
        //     console.log(`${event.loaded / event.total}%`)
        //   }
        // }
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result)
          }
        }
      })
    },
    async handleFileSize (file, maxSize, fileType) {
      let src
      if (file.size > maxSize) {
        await new Promise((resolve, reject) => {
          let image = new Image()
          image.onload = () => {
            let w = image.width
            let h = image.height
            let rate = w / this.outputWidth

            src = compress(image, w / rate, h / rate, 0.8, fileType)
            // console.log(`压缩前大小：${file.size / 1024}kb；压缩后大小：${src.length / 1024}kb`)
            resolve(src)
          }
          image.onerror = (e) => {
            reject(e)
          }
          src = createObjectURL(file)
          image.src = src
        }).catch((err) => {
          this.$message({
            content: `handleFileSize方法出错：${err}`
          })
        })
      } else {
        src = await this.readAsDataURL(file)
      }
      return src
    },
    fileChange () {
      let uploaderInput = this.$refs.uploaderInput
      uploaderInput.addEventListener('change', (e) => {
        console.log(111)
        let maxSize = this.maxSize
        let maxCount = this.maxCount
        let files = e.target.files
        let len = files.length

        for (let i = 0; i < len; ++i) {
          let file = files[i]
          let fileType = file.type
          let fileName = file.name

          if (!/image/.test(fileType)) {
            this.$message({
              content: '只能传入png, jpeg, jpg, gif格式的图片'
            })
            return
          }

          if (len > maxCount || (this.uploadedCount + len > maxCount)) {
            this.$message({
              content: `最多只能上传${maxCount}张图片，已选择${this.uploadedCount}张图片`
            })
            return
          }

          this.handleFileSize(file, maxSize, fileType).then((res) => {
            this.srcs.push(res)
            this.outputFiles.push(dataURLtoFile(res, fileName))
          })
        }

        this.uploadedCount += len
      }, false)
    }
  },
  mounted () {
    this.fileChange()
  },
  watch: {
    outputFiles (newVal) {
      if (newVal) {
        this.$emit('fileChanged', newVal)
      }
    }
  }
}
</script>

<style>
  .weui-uploader__hd{
    display:-webkit-box;
    display:-webkit-flex;
    display:flex;
    padding-bottom:10px;
    -webkit-box-align:center;
    -webkit-align-items:center;
            align-items:center;
  }
  .weui-uploader__title{
    -webkit-box-flex:1;
    -webkit-flex:1;
            flex:1;
  }
  .weui-uploader__info{
    color:#B2B2B2;
  }
  .weui-uploader__bd{
    margin-bottom:-4px;
    margin-right:-9px;
    overflow:hidden;
  }
  .weui-uploader__files{
    list-style:none;
  }
  .weui-uploader__file{
    float:left;
    margin-right:9px;
    margin-bottom:9px;
    width:79px;
    height:79px;
    background:no-repeat center center;
    background-size:cover;
  }
  .weui-uploader__file_status{
    position:relative;
  }
  .weui-uploader__file_status:before{
    content:" ";
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background-color:rgba(0, 0, 0, 0.5);
  }
  .weui-uploader__file_status .weui-uploader__file-content{
    display:block;
  }
  .weui-uploader__file-content{
    display:none;
    position:absolute;
    top:50%;
    left:50%;
    -webkit-transform:translate(-50%, -50%);
            transform:translate(-50%, -50%);
    color:#FFFFFF;
  }
  .weui-uploader__file-content .weui-icon-warn{
    display:inline-block;
  }
  .weui-uploader__input-box{
    float:left;
    position:relative;
    margin-right:9px;
    margin-bottom:9px;
    width:77px;
    height:77px;
    border:1px solid #D9D9D9;
  }
  .weui-uploader__input-box:before,
  .weui-uploader__input-box:after{
    content:" ";
    position:absolute;
    top:50%;
    left:50%;
    -webkit-transform:translate(-50%, -50%);
            transform:translate(-50%, -50%);
    background-color:#D9D9D9;
  }
  .weui-uploader__input-box:before{
    width:2px;
    height:39.5px;
  }
  .weui-uploader__input-box:after{
    width:39.5px;
    height:2px;
  }
  .weui-uploader__input-box:active{
    border-color:#999999;
  }
  .weui-uploader__input-box:active:before,
  .weui-uploader__input-box:active:after{
    background-color:#999999;
  }
  .weui-uploader__input{
    position:absolute;
    z-index:1;
    top:0;
    left:0;
    width:100%;
    height:100%;
    opacity:0;
    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
  }
  .weui-gallery{
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background-color:#000000;
    z-index:1000;
  }
  .weui-gallery__img{
    position:absolute;
    top:0;
    right:0;
    bottom:60px;
    left:0;
    background:center center no-repeat;
    background-size:contain;
  }
  .weui-gallery__opr{
    position:absolute;
    right:0;
    bottom:0;
    left:0;
    background-color:#0D0D0D;
    color:#FFFFFF;
    line-height:60px;
    text-align:center;
  }
  .weui-gallery__del{
    display:block;
  }
</style>

<style lang="less">
  .weui-uploader {
    .weui-uploader__hd {
      padding-bottom: 4px;
    }
    .weui-uploader__file {
      margin-right: 6px;
      margin-bottom: 6px;
      width: 50px;
      height: 50px;
    }
    .weui-uploader__input-box {
      margin-right: 6px;
      margin-bottom: 6px;
      width: 50px;
      height: 50px;
      background-color: #d7d7d7;
      border: none;
    }
    .weui-uploader__input-box:before {
      width: 2px;
      height: 16px;
    }
    .weui-uploader__input-box:after {
      width: 16px;
      height: 2px;
    }
    .weui-uploader__input-box:after, .weui-uploader__input-box:before {
      content: " ";
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      background-color: #858181;
    }
  }
</style>

<style scoped lang="less">
  @import '../assets/less/variable.less';
  .HuiUploader {
    .countLimitHint {
      letter-spacing: 2px;
    }
    .weui-gallery {
      &.fade-enter-active, &.fade-leave-active {
        transition: opacity .4s;
      }
      &.fade-enter, &.fade-leave-to {
        opacity: 0;
      }
    }
    .weui-gallery__del {
      i {
        color: #FFFFFF;
        font-size: 22px;
      }
    }
  }
</style>
